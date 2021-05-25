// <copyright file="AuthenticationInfo.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    /// <summary>
    /// AuthenticationInfo model represents information required to get athentication Uri.
    /// </summary>
    public class AuthenticationInfo
    {
        /// <summary>
        /// Gets or sets window location domain origin.
        /// </summary>
        public string WindowLocationOriginDomain { get; set; }

        /// <summary>
        /// Gets or sets login hint details.
        /// </summary>
        public string LoginHint { get; set; }
    }
}
