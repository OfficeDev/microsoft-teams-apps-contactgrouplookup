// <copyright file="PeoplePresenceData.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Models
{
    using Microsoft.Teams.Apps.DLLookup.Constants;

    /// <summary>
    /// PeoplePresenceData model is for member's presence information.
    /// </summary>
    public class PeoplePresenceData
    {
        /// <summary>
        /// Gets or sets the member's availability.
        /// Refer the list of base presence information https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-beta#properties
        /// Possible values are Available, AvailableIdle, Away, BeRightBack, Busy, BusyIdle, DoNotDisturb, Offline, PresenceUnknown
        /// </summary>
        public string Availability { get; set; }

        /// <summary>
        /// Gets value of sort order based on availability.
        /// </summary>
        public int AvailabilitySortOrder
        {
            get
            {
                int sortOrder = 6;
                switch (!string.IsNullOrEmpty(this.Availability) ? this.Availability : string.Empty)
                {
                    case PresenceStates.Available:
                        sortOrder = 0;
                        break;
                    case PresenceStates.Busy:
                        sortOrder = 1;
                        break;
                    case PresenceStates.DoNotDisturb:
                        sortOrder = 2;
                        break;
                    case PresenceStates.BeRightBack:
                        sortOrder = 3;
                        break;
                    case PresenceStates.Away:
                        sortOrder = 4;
                        break;
                    case PresenceStates.Offline:
                        sortOrder = 5;
                        break;
                }

                return sortOrder;
            }
        }

        /// <summary>
        /// Gets or sets member's user principal name as registered in Azure AD.
        /// </summary>
        public string UserPrincipalName { get; set; }

        /// <summary>
        /// Gets or sets user object id as registered in Azure AD.
        /// </summary>
        // [JsonProperty("Id")]
        public string Id { get; set; }
    }
}
