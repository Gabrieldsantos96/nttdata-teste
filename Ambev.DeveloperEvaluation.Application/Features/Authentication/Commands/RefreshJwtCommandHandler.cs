using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public sealed class RefreshJwtCommandHandler(IJwtService jwtService, IClaimsService claimsService, IAuthenticationService authenticationService, IUserRepository userRepository)
{
    public async Task<MutationResult<RefreshTokenResult>> Handle(RefreshJwtCommand input, CancellationToken ct)
    {

        var currentRefreshToken = await authenticationService.ValidateRefreshTokenAsync(input.RefreshToken, ct);

        var user = await userRepository.GetUserAsync(currentRefreshToken.UserRefId, ct) ?? throw new NotFoundException();

        var claims = claimsService.GenerateClaims(user);

        var (accessToken, refreshTokenHash) = jwtService.CreateJwt(claims);

        await authenticationService.RenewRefreshTokenAsync(currentRefreshToken, newToken: new RefreshToken()
        {
            TokenHash = refreshTokenHash,
            UserRefId = user.RefId
        }, ct);

        return MutationResult<RefreshTokenResult>.Ok("Usuário autenticado com sucesso", new RefreshTokenResult(accessToken, refreshTokenHash));
    }
}

