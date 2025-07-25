using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Validations;
using Ambev.DeveloperEvaluation.Shared.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Authentication;
using CommonSignInResult = Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs.SignInResult;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public sealed class SignInCommandHandler(IUserRepository userRepository, IAuthenticationService authenticationService, IJwtService jwtService, SignInManager<User> signInManager, IClaimsService claimsService)
{
    public async Task<MutationResult<object>> Handle(SignInCommand input, CancellationToken ct)
    {
        var user = await userRepository.GetUserAsync(input.Email, ct)
         ?? throw new AuthenticationException(ValidationMessages.DefaultAuthenticationError);

        var result = await signInManager.CheckPasswordSignInAsync(user, input.Password, false);

        if (result.Succeeded)
        {
            var (accessToken, refreshTokenHash) = jwtService.CreateJwt(claimsService.GenerateClaims(user));

            await authenticationService.CreateRefreshTokenAsync(new RefreshToken()
            {
                UserRefId = user.RefId,
                TokenHash = refreshTokenHash
            }, ct);

            return MutationResult<object>.Ok("Usuário autenticado com sucesso", new CommonSignInResult(accessToken, refreshTokenHash));
        }

        if (result.IsNotAllowed) throw new Exception(ValidationMessages.IsNotAllowed);

        if (result.IsLockedOut) throw new ArgumentException(ValidationMessages.UserLockedOut);

        throw new ArgumentException(ValidationMessages.DefaultAuthenticationError);
    }
}


