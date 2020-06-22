// <copyright file="DistributionListsController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Identity.Client;
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.Teams.Apps.DLLookup.Repositories;
    using Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces;

    /// <summary>
    /// Creating <see cref="DistributionListsController"/> class with ControllerBase as base class. Controller for Distribution List APIs.
    /// </summary>
    [Authorize]
    [Route("api/distributionLists")]
    [ApiController]
    public class DistributionListsController : BaseController
    {
        private readonly IFavoriteDistributionListDataRepository favoriteDistributionListDataRepository;
        private readonly ILogger<DistributionListsController> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="DistributionListsController"/> class.
        /// </summary>
        /// <param name="favoriteDistributionListDataRepository">Scoped favoriteDistributionListDataRepository instance used to read/write Distribution List related operations.</param>
        /// <param name="azureAdOptions">Instance of IOptions to read data from application configuration.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        /// <param name="confidentialClientApp">Instance of ConfidentialClientApplication class.</param>
        public DistributionListsController(
            IFavoriteDistributionListDataRepository favoriteDistributionListDataRepository,
            IConfidentialClientApplication confidentialClientApp,
            IOptions<AzureAdOptions> azureAdOptions,
            ILogger<DistributionListsController> logger)
            : base(confidentialClientApp, azureAdOptions, logger)
        {
            this.favoriteDistributionListDataRepository = favoriteDistributionListDataRepository;
            this.logger = logger;
        }

        /// <summary>
        /// Gets distribution list data from MS Graph based on search query.
        /// </summary>
        /// <param name="query">Search query used to filter distribution list.</param>
        /// <returns>A <see cref="Task"/>List of distribution lists information.</returns>
        [HttpGet]
        [Route("getDistributionList")]
        public async Task<IActionResult> GetDistributionListsAsync([FromQuery] string query)
        {
            try
            {
                string accessToken = await this.GetAccessTokenAsync();
                return this.Ok(await this.favoriteDistributionListDataRepository.GetDistributionListsAsync(query, accessToken));
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetDistributionListByQueryAsync: {ex.Message}. Parameters:{query}");
                throw;
            }
        }

        /// <summary>
        /// Gets all favorite Distribution Lists from table storage and Graph API.
        /// </summary>
        /// <returns>A <see cref="Task"/> list of favorite distribution lists details.</returns>
        [HttpGet]
        public async Task<IActionResult> GetFavoriteDistributionListsAsync()
        {
            List<FavoriteDistributionListData> favoriteDistributionList = new List<FavoriteDistributionListData>();
            try
            {
                string accessToken = await this.GetAccessTokenAsync();
                IEnumerable<FavoriteDistributionListTableEntity> favoriteDistributionListEntities = await this.favoriteDistributionListDataRepository
                    .GetFavoriteDistributionListsFromStorageAsync(this.UserObjectId);

                if (favoriteDistributionListEntities != null
                    && favoriteDistributionListEntities.Count() > 0)
                {
                    favoriteDistributionList = await this.favoriteDistributionListDataRepository
                        .GetFavoriteDistributionListsFromGraphAsync(favoriteDistributionListEntities, accessToken);
                }

                return this.Ok(favoriteDistributionList);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetFavoriteDistributionListsAsync: {ex.Message}. Property: {this.UserObjectId}");
                throw;
            }
        }

        /// <summary>
        /// Adds favorite distribution lists to database as user favorites.
        /// </summary>
        /// <param name="distributionListDetails">Distribution list array to be saved as user favorite.</param>
        /// <returns>>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateFavoriteDistributionListDataAsync([FromBody] FavoriteDistributionListData[] distributionListDetails)
        {
            try
            {
                if (distributionListDetails == null || distributionListDetails.Length == 0)
                {
                    return this.BadRequest("Post query data is either null or empty.");
                }

                for (int i = 0; i < distributionListDetails.Length; i++)
                {
                    distributionListDetails[i].UserObjectId = this.UserObjectId;
                }

                foreach (FavoriteDistributionListData currentItem in distributionListDetails)
                {
                    await this.favoriteDistributionListDataRepository.CreateOrUpdateFavoriteDistributionListAsync(currentItem);
                }

                return this.Ok();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in CreateFavoriteDistributionListDataAsync: {ex.Message}.");
                throw;
            }
        }

        /// <summary>
        /// Updates distribution list favorite status (Pin/Unpin) in database.
        /// </summary>
        /// <param name="favoriteDistributionListData">Distribution list data used to update pin status for currently logged in user.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpPut]
        public async Task<IActionResult> UpdateFavoriteDistributionListDataAsync([FromBody] FavoriteDistributionListData favoriteDistributionListData)
        {
            try
            {
                favoriteDistributionListData.UserObjectId = this.UserObjectId;
                await this.favoriteDistributionListDataRepository.CreateOrUpdateFavoriteDistributionListAsync(favoriteDistributionListData);
                return this.Ok();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in UpdateFavoriteDistributionListDataAsync: {ex.Message}.");
                throw;
            }
        }

        /// <summary>
        /// Deletes favorite distribution list from database.
        /// </summary>
        /// <param name="favoriteDistributionListData">Distribution list data to delete.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpDelete]
        public async Task<IActionResult> DeleteFavoriteDistributionListDataAsync([FromBody] FavoriteDistributionListData favoriteDistributionListData)
        {
            try
            {
                favoriteDistributionListData.UserObjectId = this.UserObjectId;

                FavoriteDistributionListTableEntity favoriteDistributionListEntity = await this.favoriteDistributionListDataRepository
                    .GetFavoriteDistributionListFromStorageAsync(
                    favoriteDistributionListData.Id,
                    this.UserObjectId);

                if (favoriteDistributionListEntity != null)
                {
                    await this.favoriteDistributionListDataRepository.RemoveFavoriteDistributionListFromStorageAsync(favoriteDistributionListEntity);
                    return this.Ok();
                }

                return this.NotFound("Favorite distribution list to be deleted is not found.");
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in DeleteFavoriteDistributionListDataAsync: {ex.Message}.");
                throw;
            }
        }
    }
}