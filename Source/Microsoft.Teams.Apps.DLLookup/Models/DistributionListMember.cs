// <copyright file="DistributionListMember.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// DistributionListMember model is for distribution list members data from AAD and table storage.
    /// </summary>
    public class DistributionListMember
    {
        /// <summary>
        /// Gets or sets odata type property for a given distribution list member.
        /// </summary>
        [JsonProperty("@odata.type")]
        public string OData_Type { get; set; }

        /// <summary>
        /// Gets Type property which indicates whether the member is a nested distributed list or a contact.
        /// </summary>
        [JsonProperty("type")]
        public string Type
        {
            get { return this.OData_Type; }
        }

        /// <summary>
        /// Gets or sets UserType property which indicates whether the member is a guest or not.
        /// </summary>
        [JsonProperty("userType")]
        public string UserType { get; set; }

        /// <summary>
        /// Gets or sets id of the corresponding distribution list member.
        /// </summary>
        [JsonProperty("id")]
        public string UserObjectId { get; set; }

        /// <summary>
        /// Gets or sets display name of the corresponding distribution list member.
        /// </summary>
        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets mail of the corresponding distribution list member.
        /// </summary>
        [JsonProperty("mail")]
        public string Mail { get; set; }

        /// <summary>
        /// Gets or sets user principal name of the corresponding distribution list member.
        /// </summary>
        [JsonProperty("userPrincipalName")]
        public string UserPrincipalName { get; set; }

        /// <summary>
        /// Gets or sets job title of the corresponding distribution list member.
        /// </summary>
        [JsonProperty("jobTitle")]
        public string JobTitle { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether record is pinned or not by the logged in user.
        /// </summary>
        public bool IsPinned { get; set; }
    }
}
