// <copyright file="UserPageSizeController.cs" company="Microsoft">
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
    /// creating <see cref="UserPageSizeController"/> class with ControllerBase as base class. Controller for page size APIs.
    /// </summary>
    [Authorize]
    [Route("api/UserPageSize")]
    [ApiController]
    public class UserPageSizeController : BaseController
    {
        private readonly UserPageSizeChoiceDataRepository userPageSizeChoiceDataRepository;
        private readonly ILogger<UserPageSizeController> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserPageSizeController"/> class.
        /// </summary>
        /// <param name="confidentialClientApp">Instance of ConfidentialClientApplication class.</param>
        /// <param name="azureAdOptions">Instance of IOptions to read data from application configuration.</param>
        /// <param name="userPageSizeChoiceDataRepository">Singleton UserPageSizeChoiceDataRepository instance used to perform read/store operations for page size.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        public UserPageSizeController(
            UserPageSizeChoiceDataRepository userPageSizeChoiceDataRepository,
            IConfidentialClientApplication confidentialClientApp,
            IOptions<AzureAdOptions> azureAdOptions,
            ILogger<UserPageSizeController> logger)
            : base(confidentialClientApp, azureAdOptions, logger)
        {
            this.userPageSizeChoiceDataRepository = userPageSizeChoiceDataRepository;
            this.logger = logger;
        }

        /// <summary>
        /// Gets the page size values for currently logged in user from database.
        /// </summary>
        /// <returns>A <see cref="Task"/> representing user page size.</returns>
        [HttpGet]
        public async Task<IActionResult> GetUserPageSizeChoiceAsync()
        {
            try
            {
                return this.Ok(await this.userPageSizeChoiceDataRepository.GetUserPageSizeChoice(this.UserObjectId));
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in getUserPageSizeChoice: {ex.Message}. Property: {this.UserObjectId}");
                throw;
            }
        }

        /// <summary>
        /// Stores page size values in database for currently logged in user.
        /// </summary>
        /// <param name="userPageSizeChoice">Page size to be stored.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateUserPageSizeChoiceAsync([FromBody] UserPageSizeChoice userPageSizeChoice)
        {
            try
            {
                await this.userPageSizeChoiceDataRepository.CreateOrUpdateUserPageSizeChoiceDataAsync(userPageSizeChoice.PageSize, userPageSizeChoice.PageId, this.UserObjectId);
                return this.Ok();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"An error occurred in CreateUserPageSizeChoiceAsync: {ex.Message}. UserObjectId:{this.UserObjectId}");
                throw;
            }
        }
    }
}