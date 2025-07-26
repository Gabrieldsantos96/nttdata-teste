using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddProblemDetails();
        return services;
    }
}