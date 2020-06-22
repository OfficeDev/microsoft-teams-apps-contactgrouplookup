// <copyright file="IFavoriteDistributionListMemberDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// This interface contains read and write operations for distribution list member.
    /// </summary>
    public interface IFavoriteDistributionListMemberDataRepository
    {
        /// <summary>
        /// Add favorite distribution list member data to storage.
        /// </summary>
        /// <param name="favoriteDistributionListMemberData">Favorite distribution list member data to be stored in table storage.</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        Task AddFavoriteDistributionListMemberAsync(FavoriteDistributionListMemberData favoriteDistributionListMemberData);

        /// <summary>
        /// Get list of distribution list members based on group id and user id.
        /// </summary>
        /// <param name="groupId">Distribution list id to filter records.</param>
        /// <param name="accessToken">Token to access MS graph</param>
        /// <param name="userObjectId">User's Azure AD Id.</param>
        /// <returns>A collection of distribution lists.</returns>
        Task<List<DistributionListMember>> GetMembersAsync(string groupId, string accessToken, string userObjectId);

        /// <summary>
        /// Adds user favorite distribution list member to storage.
        /// </summary>
        /// <param name="favoriteDistributionListMemberDataEntity">Favorite distribution list member data to be added to storage.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        Task AddFavoriteMemberToStorageAsync(FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberDataEntity);

        /// <summary>
        /// Get favorite distribution list members from storage.
        /// </summary>
        /// <param name="userObjectId">User's Azure AD id.</param>
        /// <returns>Favorite Distribution List members from storage.</returns>
        Task<IEnumerable<FavoriteDistributionListMemberTableEntity>> GetFavoriteMembersFromStorageAsync(string userObjectId);

        /// <summary>
        /// Removes distribution list member from storage.
        /// </summary>
        /// <param name="favoriteDistributionListMemberTableEntity">Favorite distribution list member data to be deleted from storage.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        Task DeleteFavoriteMemberFromStorageAsync(FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberTableEntity);

        /// <summary>
        /// Get user favorite distribution list member from storage.
        /// </summary>
        /// <param name="pinnedDistributionListId">Unique member id.</param>
        /// <param name="userObjectId">User's Azure AD id.</param>
        /// <returns>User favorite distribution list record based on pinned member and group id.</returns>
        Task<FavoriteDistributionListMemberTableEntity> GetFavoriteMemberFromStorageAsync(string pinnedDistributionListId, string userObjectId);
    }
}
