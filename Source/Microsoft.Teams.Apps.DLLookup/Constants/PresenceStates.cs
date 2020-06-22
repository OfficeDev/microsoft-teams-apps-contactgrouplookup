// <copyright file="PresenceStates.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Constants
{
    /// <summary>
    /// Maintains the Presence state constant strings supported by Presence Graph APIs
    /// Refer the list of base presence information https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-beta#properties
    /// Possible values are Available, AvailableIdle, Away, BeRightBack, Busy, BusyIdle, DoNotDisturb, Offline, PresenceUnknown
    /// </summary>
    public class PresenceStates
    {
        /// <summary>
        /// Represents available presence state
        /// </summary>
        public const string Available = "Available";

        /// <summary>
        /// Represents away presence state
        /// </summary>
        public const string Away = "Away";

        /// <summary>
        /// Represents busy presence state
        /// </summary>
        public const string Busy = "Busy";

        /// <summary>
        /// Represents be right back presence state
        /// </summary>
        public const string BeRightBack = "BeRightBack";

        /// <summary>
        /// Represents do not disturb presence state
        /// </summary>
        public const string DoNotDisturb = "DoNotDisturb";

        /// <summary>
        /// Represents offline presence state
        /// </summary>
        public const string Offline = "Offline";

        /// <summary>
        /// Represents presence unknown state
        /// </summary>
        public const string PresenceUnknown = "PresenceUnknown";
    }
}
