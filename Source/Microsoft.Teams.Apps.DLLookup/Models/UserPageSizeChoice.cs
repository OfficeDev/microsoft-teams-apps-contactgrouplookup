// <copyright file="UserPageSizeChoice.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    /// <summary>
    /// This enumeration represents different pages of application.
    /// </summary>
    public enum PageType
    {
        /// <summary>
        /// Help page.
        /// </summary>
        HelpPage,

        /// <summary>
        /// Distribution List page.
        /// </summary>
        DistributionList,

        /// <summary>
        /// Distribution List Members page.
        /// </summary>
        DistributionListMembers,
    }

    /// <summary>
    /// This model represents User's page size choice.
    /// </summary>
    public class UserPageSizeChoice
    {
        /// <summary>
        /// Gets or sets user choice for page size for a page.
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Gets or sets to which page the users choice for page size belongs to.
        /// </summary>
        public PageType PageId { get; set; }
    }
}
