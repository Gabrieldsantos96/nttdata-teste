using Ambev.DeveloperEvaluation.Application;
using Ambev.DeveloperEvaluation.Infra;
using Ambev.DeveloperEvaluation.Infra.Adapters;
using Ambev.DeveloperEvaluation.Server;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddWebServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
    try
    {
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao aplicar migrações: {ex.Message}");
        throw;
    }
}

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
    app.UseDeveloperExceptionPage();
    app.UseSwaggerGen();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.MapStaticAssets();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints(c =>
{
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

app.Run();