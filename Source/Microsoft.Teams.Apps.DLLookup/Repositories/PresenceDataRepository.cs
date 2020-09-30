// <copyright file="PresenceDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    extern alias BetaLib;

    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.DLLookup.Constants;
    using Microsoft.Teams.Apps.DLLookup.Helpers;
    using Microsoft.Teams.Apps.DLLookup.Helpers.Extentions;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// This class helps fetching user presence and contact data using MS Graph.
    /// </summary>
    public class PresenceDataRepository : IPresenceDataRepository
    {
        /// <summary>
        /// MS Graph batch limit is 20
        /// https://docs.microsoft.com/en-us/graph/known-issues#json-batching.
        /// </summary>
        private const int BatchSplitCount = 20;

        // Refer https://docs.microsoft.com/en-us/microsoftteams/presence-admins#presence-states-in-teams to learn more about Presence states in Teams
        private readonly List<string> onlinePresenceOptions = new List<string> { PresenceStates.Busy, PresenceStates.DoNotDisturb, PresenceStates.Available };

        private readonly IMemoryCache memoryCache;
        private readonly ILogger<PresenceDataRepository> logger;
        private readonly IOptions<CacheOptions> cacheOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="PresenceDataRepository"/> class.
        /// </summary>
        /// <param name="memoryCache">Singleton memory cache object.</param>
        /// <param name="cacheOptions">Singleton instance of cache configuration.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        public PresenceDataRepository(IMemoryCache memoryCache, IOptions<CacheOptions> cacheOptions, ILogger<PresenceDataRepository> logger)
        {
            this.memoryCache = memoryCache;
            this.cacheOptions = cacheOptions;
            this.logger = logger;
        }

        /// <summary>
        /// Get User presence details in a batch.
        /// </summary>
        /// <param name="peoplePresenceData">Array of People Presence Data object used to get presence information.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>People Presence Data model data filled with presence information.</returns>
        public async Task<List<PeoplePresenceData>> GetBatchUserPresenceAsync(PeoplePresenceData[] peoplePresenceData, string accessToken)
        {
            List<PeoplePresenceData> peoplePresenceDataList = new List<PeoplePresenceData>();
            List<PeoplePresenceData> peoplePresenceDataBatchResults = new List<PeoplePresenceData>();

            foreach (PeoplePresenceData member in peoplePresenceData)
            {
                string id = member.Id;
                if (!this.memoryCache.TryGetValue(id, out PeoplePresenceData peoplePresence))
                {
                    peoplePresence = new PeoplePresenceData()
                    {
                        UserPrincipalName = member.UserPrincipalName,
                        Id = member.Id,
                    };
                    peoplePresenceDataList.Add(peoplePresence);
                }
                else
                {
                    peoplePresenceDataBatchResults.Add(peoplePresence);
                }
            }

            if (peoplePresenceDataList.Count > 0)
            {
                var presenceBatches = peoplePresenceDataList.SplitList(BatchSplitCount);
                GraphUtilityHelper graphClientBeta = new GraphUtilityHelper(accessToken);

                foreach (var presenceBatch in presenceBatches)
                {
                    peoplePresenceDataBatchResults.AddRange(await graphClientBeta.GetUserPresenceAsync(presenceBatch, this.logger));
                }
            }
            else
            {
                this.logger.LogInformation($"GetBatchUserPresenceAsync. Presence of all users found in memory.");
            }

            return peoplePresenceDataBatchResults;
        }

        /// <summary>
        /// Gets online members count in a distribution list.
        /// </summary>
        /// <param name="groupId">Distribution list id.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns><see cref="Task{TResult}"/>Online members count in distribution list.</returns>
        public async Task<int> GetDistributionListMembersOnlineCountAsync(string groupId, string accessToken)
        {
            try
            {
                int onlineMembersCount = 0;
                GraphUtilityHelper graphClient = new GraphUtilityHelper(accessToken);
                var members = await this.GetMembersList(groupId, accessToken);

                var peoplePresenceDataList = new List<PeoplePresenceData>();

                foreach (DistributionListMember member in members)
                {
                    string id = member.UserObjectId;
                    if (!this.memoryCache.TryGetValue(id, out PeoplePresenceData peoplePresence))
                    {
                        peoplePresence = new PeoplePresenceData()
                        {
                            UserPrincipalName = member.UserPrincipalName,
                            Id = member.UserObjectId,
                        };
                        peoplePresenceDataList.Add(peoplePresence);
                    }
                    else
                    {
                        if (this.onlinePresenceOptions.Contains(peoplePresence.Availability))
                        {
                            onlineMembersCount++;
                        }
                    }
                }

                if (peoplePresenceDataList.Count > 0)
                {
                    MemoryCacheEntryOptions options = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(this.cacheOptions.Value.CacheInterval), // cache will expire in 300 seconds or 5 minutes
                    };

                    var presenceBatches = peoplePresenceDataList.SplitList(BatchSplitCount);

                    foreach (var presenceBatch in presenceBatches)
                    {
                        List<PeoplePresenceData> peoplePresenceResults = await graphClient.GetUserPresenceAsync(presenceBatch, this.logger);
                        for (int i = 0; i < peoplePresenceResults.Count; i++)
                        {
                            this.memoryCache.Set(peoplePresenceResults[i].Id, peoplePresenceResults[i], options);
                            if (this.onlinePresenceOptions.Contains(peoplePresenceResults[i].Availability))
                            {
                                onlineMembersCount++;
                            }
                        }
                    }
                }
                else
                {
                    this.logger.LogInformation($"Presence of all users in group found in memory.");
                }

                return onlineMembersCount;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"GetDistributionListMembersOnlineCountAsync. An error occurred: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Gets distribution list members using group API.
        /// </summary>
        /// <param name="groupId">Distribution list id to get members list.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>DistributionListMember data model.</returns>
        private async Task<IEnumerable<DistributionListMember>> GetMembersList(string groupId, string accessToken)
        {
            GraphUtilityHelper graphClient = new GraphUtilityHelper(accessToken);
            var dlMemberList = await graphClient.GetMembersListAsync(groupId, this.logger);
            return dlMemberList;
        }
    }
}
