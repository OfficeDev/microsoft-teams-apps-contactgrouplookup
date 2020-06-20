// <copyright file="DistributionList.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// DistributionList model is for distribution lists data from AAD and table storage.
    /// </summary>
    public class DistributionList
    {
        /// <summary>
        /// Gets or sets the Id from AAD for a particular distribution list.
        /// </summary>
        [JsonProperty("id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the display name from AAD for a particular distribution list.
        /// </summary>
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the mail from AAD for a particular distribution list.
        /// </summary>
        [JsonProperty("mail")]
        public string Mail { get; set; }

        /// <summary>
        /// Gets or sets the mail nickname from AAD for a particular distribution list.
        /// </summary>
        [JsonProperty("mailNickname")]
        public string MailNickname { get; set; }

        /// <summary>
        /// Gets or sets the mail enabled from AAD for a particular distribution list.
        /// </summary>
        [JsonProperty("mailEnabled")]
        public string MailEnabled { get; set; }

        /// <summary>
        /// Gets or sets the number of members in a particular distribution list.
        /// </summary>
        [JsonProperty("noOfMembers")]
        public int MembersCount { get; set; }
    }
}
