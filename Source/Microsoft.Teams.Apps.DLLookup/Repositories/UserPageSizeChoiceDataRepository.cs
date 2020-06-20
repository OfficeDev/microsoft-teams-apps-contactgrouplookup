// <copyright file="UserPageSizeChoiceDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Repositories
{
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// This class helps to add and update page size for currently logged in user.
    /// </summary>
    public class UserPageSizeChoiceDataRepository : UserPageSizeStorageProvider
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserPageSizeChoiceDataRepository"/> class.
        /// </summary>
        /// <param name="storageOptions">A set of key/value application configuration properties for Microsoft Azure Table storage.</param>
        /// <param name="logger">Sends logs to the Application Insights service.</param>
        public UserPageSizeChoiceDataRepository(
            IOptionsMonitor<StorageOptions> storageOptions,
            ILogger<FavoriteDistributionListStorageProvider> logger)
            : base(storageOptions, logger)
        {
        }

        /// <summary>
        /// This method is used to store page size into database.
        /// </summary>
        /// <param name="pageSize">Page size to be stored.</param>
        /// <param name="pageType">Page for which the page size needs to be stored.</param>
        /// <param name="userObjectId">User's Azure Active Directory Id.</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public async Task CreateOrUpdateUserPageSizeChoiceDataAsync(
                int pageSize,
                PageType pageType,
                string userObjectId)
        {
            UserPageSizeChoiceTableEntity userPageSizeChoiceDataEntity = await this.GetUserPageSizeAsync("default", userObjectId);
            if (userPageSizeChoiceDataEntity == null)
            {
                userPageSizeChoiceDataEntity = new UserPageSizeChoiceTableEntity();
            }

            userPageSizeChoiceDataEntity.DefaultValue = "default";
            userPageSizeChoiceDataEntity.UserObjectId = userObjectId;
            if (pageType == PageType.DistributionList)
            {
                userPageSizeChoiceDataEntity.DistributionListPageSize = pageSize;
            }
            else
            {
                userPageSizeChoiceDataEntity.DistributionListMemberPageSize = pageSize;
            }

            await this.UpdateUserPageSizeAsync(userPageSizeChoiceDataEntity);
        }
    }
}
