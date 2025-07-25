using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public sealed class AuthenticationService(IDatabaseContextFactory databaseContextFactory) : IAuthenticationService
{
    public async Task CreateRefreshTokenAsync(RefreshToken refreshToken, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        ctx.RefreshTokens.Add(refreshToken);

        await ctx.SaveChangesAsync(ct);
    }

    public async Task DeleteRefreshTokenAsync(string hash, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var refreshToken = await ctx.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == hash, ct)
            ?? throw new NotFoundException("Refresh token not found.");

        ctx.RefreshTokens.Remove(refreshToken);

        await ctx.SaveChangesAsync(ct);
    }

    public async Task<RefreshToken> ValidateRefreshTokenAsync(string hash, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var currentRefreshToken = await ctx.RefreshTokens
                .FirstOrDefaultAsync(s => s.TokenHash == hash, ct) ?? throw new NotFoundException();

        if (currentRefreshToken.ExpiresOnUtc < DateTime.Now)
        {
            ctx.RefreshTokens.Remove(currentRefreshToken);
            await ctx.SaveChangesAsync(ct);

            throw new ArgumentException("Refresh token expirado");
        }

        return currentRefreshToken;
    }

    public async Task RenewRefreshTokenAsync(RefreshToken current, RefreshToken newToken, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        ctx.RefreshTokens.Remove(current);

        ctx.RefreshTokens.Add(newToken);

        await ctx.SaveChangesAsync(ct);
    }
}
