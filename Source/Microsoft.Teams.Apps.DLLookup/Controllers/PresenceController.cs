// <copyright file="PresenceController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Controllers
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Identity.Client;
    using Microsoft.Teams.Apps.DLLookup.Models;
    using Microsoft.Teams.Apps.DLLookup.Repositories;

    /// <summary>
    /// creating <see cref="PresenceController"/> class with ControllerBase as base class. Controller for user presence APIs.
    /// </summary>
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PresenceController : BaseController
    {
        private readonly IPresenceDataRepository presenceDataRepository;
        private readonly ILogger<PresenceController> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="PresenceController"/> class.
        /// </summary>
        /// <param name="presenceDataRepository">Scoped PresenceDataRepository instance used to get presence information.</param>
        /// <param name="azureAdOptions">Instance of IOptions to read data from application configuration.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        /// <param name="confidentialClientApp">Instance of ConfidentialClientApplication class.</param>
        public PresenceController(
            IPresenceDataRepository presenceDataRepository,
            IConfidentialClientApplication confidentialClientApp,
            IOptions<AzureAdOptions> azureAdOptions,
            ILogger<PresenceController> logger)
            : base(confidentialClientApp, azureAdOptions, logger)
            {
                this.presenceDataRepository = presenceDataRepository;
                this.logger = logger;
            }

        /// <summary>
        /// Get User presence status details.
        /// </summary>
        /// <param name="peoplePresenceData">Array of People Presence Data object used to get presence information.</param>
        /// <returns>People Presence Data model data filled with presence information.</returns>
        [HttpPost]
        [Route("GetUserPresence")]
        public async Task<IActionResult> GetUserPresenceAsync([FromBody]PeoplePresenceData[] peoplePresenceData)
        {
            try
            {
                string accessToken = await this.GetAccessTokenAsync();
                return this.Ok(await this.presenceDataRepository.GetBatchUserPresenceAsync(peoplePresenceData, accessToken));
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while getting user presence details.");
                throw;
            }
        }

        /// <summary>
        /// Gets online members count in a distribution list.
        /// </summary>
        /// <param name="groupId">Distribution list group GUID.</param>
        /// <returns><see cref="Task{TResult}"/> Online members count in distribution list.</returns>
        [HttpGet]
        [Route("GetDistributionListMembersOnlineCount")]
        public async Task<IActionResult> GetDistributionListMembersOnlineCountAsync([FromQuery]string groupId)
        {
            try
            {
                string accessToken = await this.GetAccessTokenAsync();
                return this.Ok(await this.presenceDataRepository.GetDistributionListMembersOnlineCountAsync(groupId, accessToken));
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in GetDistributionListMembersOnlineCountAsync: {ex.Message}");
                throw;
            }
        }
    }
}