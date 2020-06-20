// <copyright file="FavoriteDistributionListMemberData.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    /// <summary>
    /// FavoriteDistributionListMemberData model represents favorite distribution list member data.
    /// </summary>
    public class FavoriteDistributionListMemberData
    {
        /// <summary>
        /// Gets or sets user id of the favorite member in the distributed list.
        /// </summary>
        public string PinnedUserId { get; set; }

        /// <summary>
        /// Gets or sets distribution list GUID, the pinned member belongs to.
        /// </summary>
        public string DistributionListId { get; set; }

        /// <summary>
        /// Gets or sets user object Id.
        /// </summary>
        public string UserObjectId { get; set; }
    }
}
