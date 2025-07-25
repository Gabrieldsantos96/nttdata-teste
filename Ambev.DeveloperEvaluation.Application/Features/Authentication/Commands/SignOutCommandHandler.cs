using Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public class SignOutEndpoint(IMediator mediator) : Endpoint<SignInCommand>
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.SignOut);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Customer);
    }

    public override async Task HandleAsync(SignInCommand req, CancellationToken ct)
    {
        await mediator.Send(req, ct);

        await SendOkAsync(ct);
    }
}

public sealed class SignOutCommandHandler(IAuthenticationService authenticationService)
{
    public async Task<MutationResult<object>> Handle(SignOutCommand input, CancellationToken ct)
    {
        await authenticationService.DeleteRefreshTokenAsync(input.RefreshToken, ct);

        return MutationResult<object>.Ok("Usuário deslogado com sucesso", new object());
    }
}
