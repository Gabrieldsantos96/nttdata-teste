FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs

FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Ambev.DeveloperEvaluation.Server/Ambev.DeveloperEvaluation.Server.csproj", "Ambev.DeveloperEvaluation.Server/"]
COPY ["ambev.developerevaluation.client/ambev.developerevaluation.client.esproj", "ambev.developerevaluation.client/"]
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