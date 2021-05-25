// <copyright file="AuthenticationMetadataController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Teams.Apps.DLLookup.Models;

    /// <summary>
    /// Controller for the authentication sign in data.
    /// </summary>
    [Route("api/authenticationMetadata")]
    public class AuthenticationMetadataController : ControllerBase
    {
        private readonly string tenantId;
        private readonly string clientId;
        private readonly string graphScope;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationMetadataController"/> class.
        /// </summary>
        /// <param name="configuration">Instance of application configuration.</param>
        public AuthenticationMetadataController(IConfiguration configuration)
        {
            this.tenantId = configuration["AzureAd:TenantId"];
            this.clientId = configuration["AzureAd:ClientId"];
            this.graphScope = configuration["AzureAd:GraphScope"];
        }

        /// <summary>
        /// Get authentication URL with configuration options.
        /// </summary>
        /// <param name="authenticationInfo">Instance of athentication info model to get window origin and login hint details.</param>
        /// <returns>Consent URL.</returns>
        [HttpPost("GetAuthenticationUrlWithConfiguration")]
        public string GetAuthenticationUrlWithConfiguration([FromBody] AuthenticationInfo authenticationInfo)
        {
            Dictionary<string, string> authDictionary = new Dictionary<string, string>
            {
                ["redirect_uri"] = $"https://{authenticationInfo.WindowLocationOriginDomain}/signin-simple-end",
                ["client_id"] = this.clientId,
                ["response_type"] = "id_token",
                ["response_mode"] = "fragment",
                ["scope"] = this.graphScope,
                ["nonce"] = Guid.NewGuid().ToString(),
                ["state"] = Guid.NewGuid().ToString(),
                ["login_hint"] = authenticationInfo.LoginHint,
            };
            List<string> authList = authDictionary
                .Select(p => $"{p.Key}={HttpUtility.UrlEncode(p.Value)}")
                .ToList();

            string authUrlPrefix = $"https://login.microsoftonline.com/{this.tenantId}/oauth2/v2.0/authorize?";

            string authUrlWithConfigUrlString = authUrlPrefix + string.Join('&', authList);

            return authUrlWithConfigUrlString;
        }

        /// <summary>
        /// Gets the application client Id.
        /// </summary>
        /// <returns>Application client Id.</returns>
        [HttpGet("GetClientId")]
        public string GetClientId()
        {
            return this.clientId;
        }
    }
}