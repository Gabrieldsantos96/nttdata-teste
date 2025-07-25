using Ambev.DeveloperEvaluation.Application;
using Ambev.DeveloperEvaluation.Infra;
using Ambev.DeveloperEvaluation.Server;
using FastEndpoints;
using FastEndpoints.Swagger;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebServices(builder.Configuration);

builder.Services.AddApplicationServices();

builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

app.UseStatusCodePages();

app.UseExceptionHandler();

if (builder.Environment.IsProduction())
{
    app.UseResponseCompression();
}

app.UseRequestLocalization("pt-BR");

app.UseRequestLocalization(new RequestLocalizationOptions()
    .AddSupportedCultures("pt-BR")
    .AddSupportedUICultures("pt-BR"));

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen();
}
else
{
    app.UseHsts();
}

app.MapStaticAssets();

app.UseWebSockets();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseFastEndpoints(c =>
{
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});


app.Run();
