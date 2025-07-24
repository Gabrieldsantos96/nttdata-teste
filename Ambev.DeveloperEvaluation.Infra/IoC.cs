using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using Ambev.DeveloperEvaluation.Infra.Claims;
using Ambev.DeveloperEvaluation.Infra.Data;
using Ambev.DeveloperEvaluation.Infra.Messaging.Idempotency;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Infra;
public static class ConfigureServices
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
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

        services.AddScoped<IClaimsService, ClaimsService>();

        services.AddDataProtection()
            .UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration
            {
                EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
                ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
            }).PersistKeysToDbContext<DatabaseContext>();
            
        services.AddMemoryCache();

        services.AddSingleton<IProcessedMessageStore, ProcessedMessageStore>();
    }
}
