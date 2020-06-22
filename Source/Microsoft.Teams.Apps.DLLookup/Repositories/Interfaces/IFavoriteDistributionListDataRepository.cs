// <copyright file="IFavoriteDistributionListDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// This interface contains read/write operations for distribution list member data.
    /// </summary>
    public interface IFavoriteDistributionListDataRepository
    {
        /// <summary>
        /// Create or update user favorite distribution list data in storage.
        /// </summary>
        /// <param name="favoriteDistributionList">Instance of favoriteDistributionListData.</param>
        /// <returns>A task that represents the work queued to execute operation.</returns>
        Task CreateOrUpdateFavoriteDistributionListAsync(FavoriteDistributionListData favoriteDistributionList);

        /// <summary>
        /// Get collection of distribution list data from MS Graph based on search query.
        /// </summary>
        /// <param name="query">Search query string to filter distribution list based on name.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>A collection of filtered distribution lists based on query.</returns>
        Task<List<DistributionList>> GetDistributionListsAsync(string query, string accessToken);

        /// <summary>
        /// Get collection of user favorite distribution lists from storage.
        /// </summary>
        /// <param name="userObjectId">User's Azure AD id.</param>
        /// <returns>A collection of favorite distribution list entities.</returns>
        Task<IEnumerable<FavoriteDistributionListTableEntity>> GetFavoriteDistributionListsFromStorageAsync(string userObjectId);

        /// <summary>
        /// Adds favorite distribution list to storage.
        /// </summary>
        /// <param name="favoriteDistributionListEntity">Distribution list entity to be added as favorite.</param>
        /// <returns>An add task that represents the work queued to execute.</returns>
        Task AddFavoriteDistributionListToStorageAsync(FavoriteDistributionListTableEntity favoriteDistributionListEntity);

        /// <summary>
        /// Remove favorite distribution list from storage.
        /// </summary>
        /// <param name="favoriteDistributionListEntity">Distribution list entity to be removed as favorite.</param>
        /// <returns>A delete task that represents the work queued to execute.</returns>
        Task RemoveFavoriteDistributionListFromStorageAsync(FavoriteDistributionListTableEntity favoriteDistributionListEntity);

        /// <summary>
        /// Get user favorite distribution list from storage for user id.
        /// </summary>
        /// <param name="favoriteDistributionListId">Distribution list id to be deleted.</param>
        /// <param name="userObjectId">User Azure AD id.</param>
        /// <returns>User favorite distribution list record.</returns>
        Task<FavoriteDistributionListTableEntity> GetFavoriteDistributionListFromStorageAsync(string favoriteDistributionListId, string userObjectId);

        /// <summary>
        /// Gets favorite distribution list details using MS graph.
        /// </summary>
        /// <param name="favoriteDistributionListEntities">List of favorite distribution list records.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>A collection of favorite distribution list entities.</returns>
        Task<List<FavoriteDistributionListData>> GetFavoriteDistributionListsFromGraphAsync(
            IEnumerable<FavoriteDistributionListTableEntity> favoriteDistributionListEntities,
            string accessToken);
    }
}
