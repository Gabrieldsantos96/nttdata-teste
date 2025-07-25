using Ambev.DeveloperEvaluation.Application.Behaviors;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Infra.Adapters;
using Ambev.DeveloperEvaluation.Server.Config;
using Ambev.DeveloperEvaluation.Server.Identity;
using FastEndpoints;
using FastEndpoints.Swagger;
using MediatR.NotificationPublishers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Reflection;
using System.Text;

namespace Ambev.DeveloperEvaluation.Server;
public static class ConfigureServices
{
    public static IServiceCollection AddWebServices(this IServiceCollection services, IConfiguration configuration)
    {

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                RequireExpirationTime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                ClockSkew = TimeSpan.Zero,

            };
        });

        services.AddAuthorizationBuilder();

        services.AddCascadingAuthenticationState();

        services.AddIdentityCore<User>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = true;
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;
            options.Password.RequiredUniqueChars = 1;
        })
            .AddEntityFrameworkStores<DatabaseContext>()
            .AddErrorDescriber<PortugueseIdentityErrorDescriber>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        services.ConfigureOptions<ConfigureSecurityStampOptions>();

        services.AddFastEndpoints().SwaggerDocument(x => x.EnableJWTBearerAuth = true);

        var applicationAssembly = Assembly.GetAssembly(typeof(Application.ConfigureServices)) ?? throw new AppDomainUnloadedException();

        services.AddMediatR(cfg =>
        {
            cfg.LicenseKey = configuration["mediatr"];
            cfg.RegisterServicesFromAssembly(applicationAssembly);
            cfg.AddOpenRequestPreProcessor(typeof(LoggingBehaviour<>));
            cfg.NotificationPublisher = new TaskWhenAllPublisher();
            cfg.NotificationPublisherType = typeof(TaskWhenAllPublisher);
        });

        services.AddHttpContextAccessor();

        services.AddEndpointsApiExplorer();


        var supportedCultures = new[]
        {
            new CultureInfo("en-US"),
            new CultureInfo("pt-BR"),
        };
        services.Configure<RequestLocalizationOptions>(options =>
        {
            options.DefaultRequestCulture = new RequestCulture("pt-BR");
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;
        });

        return services;
    }
}
