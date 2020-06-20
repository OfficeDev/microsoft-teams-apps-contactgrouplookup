// <copyright file="DistributionListMembersController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Controllers
{
    using System;
    using System.Collections.Generic;
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
    /// Creating <see cref="DistributionListMembersController"/> class with ControllerBase as base class. Controller for Distribution List member APIs.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DistributionListMembersController : BaseController
    {
        private readonly IFavoriteDistributionListMemberDataRepository favoriteDistributionListMemberDataRepository;
        private readonly ILogger<DistributionListMembersController> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="DistributionListMembersController"/> class.
        /// </summary>
        /// <param name="favoriteDistributionListMemberDataRepository">Scoped FavoriteDistributionListMemberDataRepository instance used to read/write distribution list member related operations.</param>
        /// <param name="azureAdOptions">Instance of IOptions to read data from application configuration.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        /// <param name="confidentialClientApp">Instance of ConfidentialClientApplication class.</param>
        public DistributionListMembersController(
            IFavoriteDistributionListMemberDataRepository favoriteDistributionListMemberDataRepository,
            IOptions<AzureAdOptions> azureAdOptions,
            ILogger<DistributionListMembersController> logger,
            IConfidentialClientApplication confidentialClientApp)
            : base(confidentialClientApp, azureAdOptions, logger)
        {
            this.favoriteDistributionListMemberDataRepository = favoriteDistributionListMemberDataRepository;
            this.logger = logger;
        }

        /// <summary>
        /// Gets the members in a Distribution List using the group GUID from Graph API.
        /// </summary>
        /// <param name="groupId">Distribution list group GUID.</param>
        /// <returns><DistributionListMember>A <see cref="Task"/> list of Distribution List members information.</DistributionListMember></returns>
        [HttpGet]
        public async Task<IActionResult> GetMembersAsync([FromQuery] string groupId)
        {
            try
            {
                if (groupId == null || groupId.Length == 0)
                {
                    return this.BadRequest("Post query data is either null or empty.");
                }

                string accessToken = await this.GetAccessTokenAsync();
                List<DistributionListMember> distributionListMembers = await this.favoriteDistributionListMemberDataRepository
                    .GetMembersAsync(groupId, accessToken, this.UserObjectId);
                return this.Ok(distributionListMembers);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetMembersAsync: {ex.Message}, Parameters:{groupId}");
                throw;
            }
        }

        /// <summary>
        /// Adds member data to the table storage on being pinned by the user.
        /// </summary>
        /// <param name="favoriteDistributionListMemberData">Instance of favorite Distribution List member data holding the values sent by the user.</param>
        /// <returns><Task>A <see cref="Task"/> representing the asynchronous operation.</Task></returns>
        [HttpPost]
        public async Task<IActionResult> CreateFavoriteDistributionMemberListDataAsync([FromBody] FavoriteDistributionListMemberData favoriteDistributionListMemberData)
        {
            try
            {
                favoriteDistributionListMemberData.UserObjectId = this.UserObjectId;
                await this.favoriteDistributionListMemberDataRepository.AddFavoriteDistributionListMemberAsync(favoriteDistributionListMemberData);

                return this.Ok();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in CreateFavoriteDistributionMemberListDataAsync: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Updates azure table storage when user unpins their favorite members.
        /// </summary>
        /// <param name="favoriteDistributionListMemberData">Instance of FavoriteDistributionListMemberData holding the values sent by the user for unpin.</param>
        /// <returns><Task>A <see cref="Task"/> representing the asynchronous operation.</Task></returns>
        [HttpDelete]
        public async Task<IActionResult> DeleteFavoriteDistributionListMemberDataAsync([FromBody] FavoriteDistributionListMemberData favoriteDistributionListMemberData)
        {
            try
            {
                favoriteDistributionListMemberData.UserObjectId = this.UserObjectId;

                FavoriteDistributionListMemberTableEntity favoriteDistributionListMemberDataEntity = await this.favoriteDistributionListMemberDataRepository
                    .GetFavoriteMemberFromStorageAsync(favoriteDistributionListMemberData.PinnedUserId + favoriteDistributionListMemberData.DistributionListId,  favoriteDistributionListMemberData.UserObjectId);

                if (favoriteDistributionListMemberDataEntity != null)
                {
                    await this.favoriteDistributionListMemberDataRepository.DeleteFavoriteMemberFromStorageAsync(favoriteDistributionListMemberDataEntity);
                }

                return this.Ok();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in DeleteFavoriteDistributionListMemberDataAsync: {ex.Message}");
                throw;
            }
        }
    }
}