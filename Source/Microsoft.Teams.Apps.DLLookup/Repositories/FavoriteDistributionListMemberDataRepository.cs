// <copyright file="FavoriteDistributionListMemberDataRepository.cs" company="Microsoft">
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
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces;

    /// <summary>
    /// This class contains read and write operations for distribution list member on AAD and table storage.
    /// </summary>
    public class FavoriteDistributionListMemberDataRepository : FavoriteDistributionListMemberStorageProvider, IFavoriteDistributionListMemberDataRepository
    {
        private readonly ILogger logger;
        private GraphUtilityHelper graphClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="FavoriteDistributionListMemberDataRepository"/> class.
        /// </summary>
        /// <param name="storageOptions">A set of key/value application configuration properties for Microsoft Azure Table storage.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        public FavoriteDistributionListMemberDataRepository(
            IOptionsMonitor<StorageOptions> storageOptions,
            ILogger<FavoriteDistributionListDataRepository> logger)
            : base(storageOptions, logger)
        {
            this.logger = logger;
        }

        /// <summary>
        /// Adds distribution list member data.
        /// </summary>
        /// <param name="favoriteDistributionListMemberData">Favorite distribution list member data to be stored in database.</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public async Task AddFavoriteDistributionListMemberAsync(
           FavoriteDistributionListMemberData favoriteDistributionListMemberData)
        {
            FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberDataEntity = new FavoriteDistributionListMemberTableEntity()
            {
                DistributionListMemberId = (favoriteDistributionListMemberData.PinnedUserId + favoriteDistributionListMemberData.DistributionListId).ToLower(),
                DistributionListId = favoriteDistributionListMemberData.DistributionListId,
                UserObjectId = favoriteDistributionListMemberData.UserObjectId,
            };

            await this.AddFavoriteMemberToStorageAsync(favoriteDistributionListMemberDataEntity);
        }

        /// <summary>
        /// Gets Distribution List members from Graph and table storage.
        /// </summary>
        /// <param name="groupId">Distribution list id to filter records.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>A collection of distribution list members.</returns>
        public async Task<List<DistributionListMember>> GetMembersAsync(
            string groupId,
            string accessToken,
            string userObjectId)
        {
            this.graphClient = new GraphUtilityHelper(accessToken);

            List<DistributionListMember> distributionListMemberList = await this.graphClient.GetDistributionListMembersAsync(groupId, this.logger);

            IEnumerable<FavoriteDistributionListMemberTableEntity> favoriteDistributionListMemberEntity = await this.GetFavoriteMembersFromStorageAsync(userObjectId);
            foreach (DistributionListMember member in distributionListMemberList)
            {
                string distributionListMemberId = member.UserObjectId + groupId;
                foreach (FavoriteDistributionListMemberTableEntity entity in favoriteDistributionListMemberEntity)
                {
                    if (entity.DistributionListMemberId == distributionListMemberId)
                    {
                        member.IsPinned = true;
                    }
                }
            }

            return distributionListMemberList
                .Where(member => member.Type == "#microsoft.graph.group"
                || string.Equals(member.UserType, "member", StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
    }
}
