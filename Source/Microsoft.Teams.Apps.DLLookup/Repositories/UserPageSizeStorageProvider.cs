// <copyright file="UserPageSizeStorageProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    ///  This class helps to get, create and update page size for currently logged in user from storage.
    /// </summary>
    public class UserPageSizeStorageProvider : BaseStorageProvider
    {
        private const string UserPageSizeTableName = "UserPageSizeChoices";

        /// <summary>
        /// Instance to send logs to the Application Insights service.
        /// </summary>
        private readonly ILogger<FavoriteDistributionListStorageProvider> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserPageSizeStorageProvider"/> class.
        /// </summary>
        /// <param name="storageOptions">A set of key/value application configuration properties for Microsoft Azure Table storage.</param>
        /// <param name="logger">Sends logs to the Application Insights service.</param>
        public UserPageSizeStorageProvider(
            IOptionsMonitor<StorageOptions> storageOptions,
            ILogger<FavoriteDistributionListStorageProvider> logger)
            : base(storageOptions, UserPageSizeTableName)
        {
            this.logger = logger;
        }

        /// <summary>
        /// To query page size information of a particular user from table storage.
        /// </summary>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>Distribution list and distribution list members page size.</returns>
        public async Task<UserPageSizeChoiceTableEntity> GetUserPageSizeChoice(string userObjectId)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.Retrieve<UserPageSizeChoiceTableEntity>("default", userObjectId);
                TableResult result = await this.DlLookupCloudTable.ExecuteAsync(operation);
                return result.Result as UserPageSizeChoiceTableEntity;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetUserPageSizeChoice: userObjectId: {userObjectId}.");
                throw;
            }
        }

        /// <summary>
        /// Get an entity by the keys in the table storage.
        /// </summary>
        /// <param name="partitionKey">The partition key of the entity.</param>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>The entity matching the keys.</returns>
        public async Task<UserPageSizeChoiceTableEntity> GetUserPageSizeAsync(string partitionKey, string userObjectId)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.Retrieve<UserPageSizeChoiceTableEntity>(partitionKey.ToLower(), userObjectId.ToLower());
                TableResult result = await this.DlLookupCloudTable.ExecuteAsync(operation);
                return result.Result as UserPageSizeChoiceTableEntity;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetUserPageSizeAsync: userObjectId: {userObjectId}.");
                throw;
            }
        }

        /// <summary>
        /// Create or update an entity in the table storage.
        /// </summary>
        /// <param name="userPageSizeChoiceTableEntity">User page size entity to be updated.</param>
        /// <returns>A task that represents the delete queued to execute.</returns>
        public async Task UpdateUserPageSizeAsync(UserPageSizeChoiceTableEntity userPageSizeChoiceTableEntity)
        {
            try
            {
                await this.EnsureInitializedAsync();
                TableOperation operation = TableOperation.InsertOrReplace(userPageSizeChoiceTableEntity);
                await this.DlLookupCloudTable.ExecuteAsync(operation);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in UpdateUserPageSizeAsync: UserObjectId: {userPageSizeChoiceTableEntity.UserObjectId}.");
                throw;
            }
        }
    }
}
