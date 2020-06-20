// <copyright file="UserPageSizeChoiceTableEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// User page size choice table entity class used to represent user's page size choices.
    /// </summary>
    public class UserPageSizeChoiceTableEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets distribution list page size.
        /// </summary>
        public int DistributionListPageSize { get; set; }

        /// <summary>
        /// Gets or sets distribution list members page size.
        /// </summary>
        public int DistributionListMemberPageSize { get; set; }

        /// <summary>
        /// Gets or sets Partition key with "default" value.
        /// </summary>
        [IgnoreProperty]
        public string DefaultValue
        {
            get { return this.PartitionKey; }
            set { this.PartitionKey = value; }
        }

        /// <summary>
        /// Gets or sets Row key with user's AAD object Id.
        /// </summary>
        [IgnoreProperty]
        public string UserObjectId
        {
            get { return this.RowKey; }
            set { this.RowKey = value; }
        }
    }
}
