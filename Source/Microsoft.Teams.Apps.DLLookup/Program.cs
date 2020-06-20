// <copyright file="Program.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup
{
    using System;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;

    /// <summary>
    /// Default Program class.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Default Main method.
        /// </summary>
        /// <param name="args">string array input parameters.</param>
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        /// <summary>
        /// Method to create default builder.
        /// </summary>
        /// <param name="args">string input parameter from Main method.</param>
        /// <returns>Calls Startup method.</returns>
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
             .ConfigureAppConfiguration((hostingContext, config) =>
             {
                 config.AddEnvironmentVariables();
             })
                .UseStartup<Startup>()
            .ConfigureLogging((hostingContext, logging) =>
            {
                // hostingContext.HostingEnvironment can be used to determine environments as well.
                var appInsightKey = hostingContext.Configuration["ApplicationInsights:InstrumentationKey"];
                logging.AddApplicationInsights(appInsightKey);

                // This will capture Info level traces and above.
                if (!Enum.TryParse(hostingContext.Configuration["ApplicationInsights:LogLevel:Default"], out LogLevel logLevel))
                {
                    logLevel = LogLevel.Information;
                }

                logging.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>(string.Empty, logLevel);
            });
    }
}
