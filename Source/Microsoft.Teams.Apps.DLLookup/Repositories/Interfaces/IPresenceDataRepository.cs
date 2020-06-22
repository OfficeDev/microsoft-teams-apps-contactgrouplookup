// <copyright file="IPresenceDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// Interface <see cref="IPresenceDataRepository"/> helps fetching user presence and contact data.
    /// </summary>
    public interface IPresenceDataRepository
    {
        /// <summary>
        /// Get User presence details executing in batches.
        /// </summary>
        /// <param name="peoplePresenceData">Collection of people presence data object used to get presence information.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns>A collection of people presence data providing user presence information.</returns>
        Task<List<PeoplePresenceData>> GetBatchUserPresenceAsync(PeoplePresenceData[] peoplePresenceData, string accessToken);

        /// <summary>
        /// Gets online members count in a distribution list.
        /// </summary>
        /// <param name="groupId">Distribution list id.</param>
        /// <param name="accessToken">Token to access MS graph.</param>
        /// <returns><see cref="Task{TResult}"/>Online members count in given distribution list id.</returns>
        Task<int> GetDistributionListMembersOnlineCountAsync(string groupId, string accessToken);
    }
}