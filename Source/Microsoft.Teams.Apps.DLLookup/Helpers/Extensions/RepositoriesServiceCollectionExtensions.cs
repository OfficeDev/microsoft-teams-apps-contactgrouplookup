// <copyright file="RepositoriesServiceCollectionExtensions.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup.Helpers.Extentions
{
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Teams.Apps.DLLookup.Repositories;
    using Microsoft.Teams.Apps.DLLookup.Repositories.Interfaces;

    /// <summary>
    /// Class to add DI services for repositories.
    /// </summary>
    public static class RepositoriesServiceCollectionExtensions
    {
        /// <summary>
        /// Extension method to register repository services in DI container.
        /// </summary>
        /// <param name="services">IServiceCollection instance to which repository services to be added in.</param>
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IFavoriteDistributionListDataRepository, FavoriteDistributionListDataRepository>();
            services.AddScoped<IFavoriteDistributionListMemberDataRepository, FavoriteDistributionListMemberDataRepository>();
            services.AddScoped<IPresenceDataRepository, PresenceDataRepository>();
            services.AddSingleton<UserPageSizeChoiceDataRepository>();
        }
    }
}
