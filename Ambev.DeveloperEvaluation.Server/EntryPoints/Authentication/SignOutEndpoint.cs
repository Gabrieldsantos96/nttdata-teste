using Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.EntryPoints.Authentication;

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