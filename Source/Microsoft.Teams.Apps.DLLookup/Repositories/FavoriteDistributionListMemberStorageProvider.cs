// <copyright file="FavoriteDistributionListMemberStorageProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// The class contains read, write and delete operations for distribution list member on table storage.
    /// </summary>
    public class FavoriteDistributionListMemberStorageProvider : BaseStorageProvider
    {
        private const string FavoriteMembersTableName = "FavoriteDistributionListMembers";

        /// <summary>
        /// Instance to send logs to the Application Insights service.
        /// </summary>
        private readonly ILogger<FavoriteDistributionListStorageProvider> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FavoriteDistributionListMemberStorageProvider"/> class.
        /// </summary>
        /// <param name="storageOptions">A set of key/value application configuration properties for Microsoft Azure Table storage.</param>
        /// <param name="logger">Sends logs to the Application Insights service.</param>
        public FavoriteDistributionListMemberStorageProvider(
            IOptionsMonitor<StorageOptions> storageOptions,
            ILogger<FavoriteDistributionListStorageProvider> logger)
            : base(storageOptions, FavoriteMembersTableName)
        {
            this.logger = logger;
        }

        /// <summary>
        /// Adds favorite distribution list member data to table storage.
        /// </summary>
        /// <param name="favoriteDistributionListMemberDataEntity">Favorite distribution list member data to be added to storage.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        public async Task AddFavoriteMemberToStorageAsync(FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberDataEntity)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.InsertOrReplace(favoriteDistributionListMemberDataEntity);
                await this.DlLookupCloudTable.ExecuteAsync(operation);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in AddFavoriteMemberToStorageAsync: DistributionListMemberId: {favoriteDistributionListMemberDataEntity.UserObjectId}.");
                throw;
            }
        }

        /// <summary>
        /// Gets favorite distribution list members from table storage.
        /// </summary>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>List of pinned members.</returns>
        public async Task<IEnumerable<FavoriteDistributionListMemberTableEntity>> GetFavoriteMembersFromStorageAsync(string userObjectId)
        {
            try
            {
                await this.EnsureInitializedAsync();
                string partitionKeyFilter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, userObjectId);
                TableQuery<FavoriteDistributionListMemberTableEntity> query = new TableQuery<FavoriteDistributionListMemberTableEntity>().Where(partitionKeyFilter);
                IList<FavoriteDistributionListMemberTableEntity> entities = await this.ExecuteQueryAsync(query);
                return entities;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetFavoriteMembersFromStorageAsync.");
                throw;
            }
        }

        /// <summary>
        /// Removes Distribution List member from table storage.
        /// </summary>
        /// <param name="favoriteDistributionListMemberTableEntity">Favorite distribution list member data to be deleted from storage.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        public async Task DeleteFavoriteMemberFromStorageAsync(FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberTableEntity)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.Delete(favoriteDistributionListMemberTableEntity);
                await this.DlLookupCloudTable.ExecuteAsync(operation);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in DeleteFavoriteMemberFromStorageAsync: UserObjectId: {favoriteDistributionListMemberTableEntity.UserObjectId}.");
                throw;
            }
        }

        /// <summary>
        /// Gets a favorite distribution list member from table storage.
        /// </summary>
        /// <param name="pinnedDistributionListId">Pinned member id and distribution id as row key.</param>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>Favorite distribution list member record.</returns>
        public async Task<FavoriteDistributionListMemberTableEntity> GetFavoriteMemberFromStorageAsync(string pinnedDistributionListId, string userObjectId)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.Retrieve<FavoriteDistributionListMemberTableEntity>(userObjectId, pinnedDistributionListId.ToLower());
                TableResult result = await this.DlLookupCloudTable.ExecuteAsync(operation);
                return result.Result as FavoriteDistributionListMemberTableEntity;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetFavoriteDistributionListFromStorageAsync: userObjectId: {userObjectId}.");
                throw;
            }
        }

        /// <summary>
        /// Execute Table query operation.
        /// </summary>
        /// <param name="query">Search query used to filter distribution list.</param>
        /// <param name="count">Optional parameter. Maximum number of desired entities.</param>
        /// <param name="cancellationToken">Cancellation token details.</param>
        /// <returns>Result of the asynchronous operation.</returns>
        private async Task<IList<FavoriteDistributionListMemberTableEntity>> ExecuteQueryAsync(
            TableQuery<FavoriteDistributionListMemberTableEntity> query,
            int? count = null,
            CancellationToken cancellationToken = default)
        {
            query.TakeCount = count;

            try
            {
                List<FavoriteDistributionListMemberTableEntity> result = new List<FavoriteDistributionListMemberTableEntity>();
                TableContinuationToken token = null;

                do
                {
                    TableQuerySegment<FavoriteDistributionListMemberTableEntity> segment = await this.DlLookupCloudTable.ExecuteQuerySegmentedAsync<FavoriteDistributionListMemberTableEntity>(query, token);
                    token = segment.ContinuationToken;
                    result.AddRange(segment);
                }
                while (token != null
                    && !cancellationToken.IsCancellationRequested
                    && (count == null || result.Count < count.Value));

                return result;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error occurred while executing the table query.");
                throw;
            }
        }
    }
}
