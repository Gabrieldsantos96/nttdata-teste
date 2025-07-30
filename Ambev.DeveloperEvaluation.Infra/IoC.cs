using Amazon.S3;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Infra.Adapters;
using Ambev.DeveloperEvaluation.Infra.Repositories;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Raven.Client.Documents;

namespace Ambev.DeveloperEvaluation.Infra;
public static class ConfigureServices
{
    public static async Task AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContextFactory<DatabaseContext>(options =>
        {
            options.UseSqlServer(configuration["DatabaseContext"], sqlBuilder =>
            {
                sqlBuilder.EnableRetryOnFailure();
                sqlBuilder.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            });

            options.EnableDetailedErrors();
            options.EnableSensitiveDataLogging();
        });

        services.AddSingleton<IDocumentStore>(serviceProvider =>
        {
            var requiredService = serviceProvider.GetRequiredService<IConfiguration>();

            string serverUrl = configuration["RavenDB:Server"]!;
            string databaseName = configuration["RavenDB:Database"]!;

            var store = RavenDbContext.CreateDocumentStore(
                serverUrl: serverUrl,
                databaseName: databaseName!);

            return store;
        });


        services.AddScoped<IClaimsService, ClaimsService>();

        services.AddDataProtection()
            .UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration
            {
                EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
                ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
            }).PersistKeysToDbContext<DatabaseContext>();

        services.AddMemoryCache();

        services.AddSingleton<IAmazonS3>(sp =>
        {
            return S3FileStorageService.CreateAmazonS3Client(configuration);
        });

        services.AddSingleton<IFileStorageService, S3FileStorageService>();

        services.AddScoped<IDatabaseContextFactory, DatabaseContextFactory>();

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IClaimsService, ClaimsService>();
        services.AddScoped<IPasswordHelper, PasswordHelper>();
        

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICartRepository, CartRepository>();
        services.AddScoped<ISaleRepository, SaleRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();

        using var serviceScope = services.BuildServiceProvider().CreateScope();
        var store = serviceScope.ServiceProvider.GetRequiredService<IDocumentStore>();

        await RavenDbContext.SeedDatabase(store);

    }
}
