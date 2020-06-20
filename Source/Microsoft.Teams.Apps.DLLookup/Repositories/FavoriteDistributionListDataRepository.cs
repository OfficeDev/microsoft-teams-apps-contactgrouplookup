// <copyright file="FavoriteDistributionListDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.DLLookup.Helpers;
    using Microsoft.Teams.Apps.DLLookup.Helpers.Extentions;
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces;

    /// <summary>
    /// This class contains read, write and update operations for distribution list member data on AAD and table storage.
    /// </summary>
    public class FavoriteDistributionListDataRepository : FavoriteDistributionListStorageProvider, IFavoriteDistributionListDataRepository
    {
        /// <summary>
        /// MS Graph batch limit is 20. Setting it 10 here as 2 APIs are added in batch.
        /// https://docs.microsoft.com/en-us/graph/known-issues#json-batching.
        /// </summary>
        private const int BatchSplitCount = 10;
        private readonly ILogger<FavoriteDistributionListDataRepository> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FavoriteDistributionListDataRepository"/> class.
        /// </summary>
        /// <param name="storageOptions">A set of key/value application configuration properties for Microsoft Azure Table storage.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        public FavoriteDistributionListDataRepository(
            IOptionsMonitor<StorageOptions> storageOptions,
            ILogger<FavoriteDistributionListDataRepository> logger)
            : base(storageOptions, logger)
        {
            this.logger = logger;
        }

        /// <summary>
        /// Creates/Updates favorite distribution list data in table storage.
        /// </summary>
        /// <param name="favoriteDistributionListData">Instance of favoriteDistributionListData.</param>
        /// <returns>Returns data model.</returns>
        public async Task CreateOrUpdateFavoriteDistributionListAsync(
           FavoriteDistributionListData favoriteDistributionListData)
        {
            FavoriteDistributionListTableEntity favoriteDistributionListDataEntity = new FavoriteDistributionListTableEntity()
            {
                GroupId = favoriteDistributionListData.Id,
                PinStatus = favoriteDistributionListData.IsPinned,
                UserObjectId = favoriteDistributionListData.UserObjectId,
            };

            await this.AddFavoriteDistributionListToStorageAsync(favoriteDistributionListDataEntity);
        }

        /// <summary>
        /// Gets distribution list data from MS Graph based on search query.
        /// </summary>
        /// <param name="query">Search query used to filter distribution list.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>Distribution lists filtered with search query.</returns>
        public async Task<List<DistributionList>> GetDistributionListsAsync(
            string query, string accessToken)
        {
            GraphUtilityHelper graphClient = new GraphUtilityHelper(accessToken);
            var distributionList = await graphClient.GetDistributionListsAsync(query, this.logger);
            return distributionList.ToList();
        }

        /// <summary>
        /// Get favorite distribution list details and members count from Graph.
        /// </summary>
        /// <param name="groupIds">List of Distribution List Ids.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>Count of members in distribution list.</returns>
        public async Task<List<DistributionList>> GetDistributionListDetailsFromGraphAsync(
            List<string> groupIds,
            string accessToken)
        {
            // MS Graph batch limit is 20
            // refer https://docs.microsoft.com/en-us/graph/known-issues#json-batching to known issues with Microsoft Graph batch APIs
            IEnumerable<List<string>> groupBatches = groupIds.SplitList(BatchSplitCount);
            List<DistributionList> distributionListList = new List<DistributionList>();
            GraphUtilityHelper graphClient = new GraphUtilityHelper(accessToken);

            foreach (List<string> groupBatch in groupBatches)
            {
                try
                {
                    distributionListList.AddRange(await graphClient.GetDistributionListDetailsAsync(groupBatch, this.logger));
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex, $"An error occurred in GetDistributionListDetailsFromGraphAsync.");
                }
            }

            return distributionListList;
        }

        /// <summary>
        /// Gets favorite Distribution List details from Graph.
        /// </summary>
        /// <param name="favoriteDistributionListEntities">Favorite Distribution List data from storage.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>Favorite distribution list data from graph.</returns>
        public async Task<List<FavoriteDistributionListData>> GetFavoriteDistributionListsFromGraphAsync(
            IEnumerable<FavoriteDistributionListTableEntity> favoriteDistributionListEntities,
            string accessToken)
        {
            List<FavoriteDistributionListData> favoriteDistributionList = new List<FavoriteDistributionListData>();

            List<string> groupIds = favoriteDistributionListEntities.Select(dl => dl.GroupId).ToList();
            List<DistributionList> distributionList = await this.GetDistributionListDetailsFromGraphAsync(groupIds, accessToken);

            foreach (FavoriteDistributionListTableEntity currentItem in favoriteDistributionListEntities)
            {
                DistributionList currentDistributionList = distributionList.Find(dl => dl.Id == currentItem.GroupId);
                if (currentDistributionList == null)
                {
                    continue;
                }

                favoriteDistributionList.Add(
                    new FavoriteDistributionListData
                    {
                        IsPinned = currentItem.PinStatus,
                        DisplayName = currentDistributionList.DisplayName,
                        Mail = currentDistributionList.Mail,
                        ContactsCount = currentDistributionList.MembersCount,
                        Id = currentItem.GroupId,
                        UserObjectId = currentItem.UserObjectId,
                    });
            }

            return favoriteDistributionList;
        }
    }
}
