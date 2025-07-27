FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Ambev.DeveloperEvaluation.Server/Ambev.DeveloperEvaluation.Server.csproj", "Ambev.DeveloperEvaluation.Server/"]
COPY ["Ambev.DeveloperEvaluation.Application/Ambev.DeveloperEvaluation.Application.csproj", "Ambev.DeveloperEvaluation.Application/"]
COPY ["Ambev.DeveloperEvaluation.Domain/Ambev.DeveloperEvaluation.Domain.csproj", "Ambev.DeveloperEvaluation.Domain/"]
COPY ["Ambev.DeveloperEvaluation.Shared/Ambev.DeveloperEvaluation.Shared.csproj", "Ambev.DeveloperEvaluation.Shared/"]
COPY ["Ambev.DeveloperEvaluation.Infra/Ambev.DeveloperEvaluation.Infra.csproj", "Ambev.DeveloperEvaluation.Infra/"]
RUN dotnet restore "./Ambev.DeveloperEvaluation.Server/Ambev.DeveloperEvaluation.Server.csproj"
COPY . .
WORKDIR "/src/Ambev.DeveloperEvaluation.Server"
RUN dotnet build "./Ambev.DeveloperEvaluation.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Ambev.DeveloperEvaluation.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Ambev.DeveloperEvaluation.Server.dll"]