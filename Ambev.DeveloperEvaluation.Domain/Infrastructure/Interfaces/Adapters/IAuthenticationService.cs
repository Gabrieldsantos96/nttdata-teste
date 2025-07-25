using Ambev.DeveloperEvaluation.Domain.Entities;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
public interface IAuthenticationService
{
    Task CreateRefreshTokenAsync(RefreshToken refreshToken, CancellationToken ct);
    Task DeleteRefreshTokenAsync(string hash, CancellationToken ct);
    Task<RefreshToken> ValidateRefreshTokenAsync(string hash, CancellationToken ct);
    Task RenewRefreshTokenAsync(RefreshToken current, RefreshToken newToken, CancellationToken ct);
}
