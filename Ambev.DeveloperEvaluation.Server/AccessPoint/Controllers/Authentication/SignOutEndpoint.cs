using Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.AccessPoint.Controllers.Authentication;
public class SignOutEndpoint(IMediator mediator) : Endpoint<SignOutDto, MutationResult<object>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.SignOut);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Customer);
    }

    public override async Task HandleAsync(SignOutDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new SignOutCommand(req.RefreshToken), ct);

        await SendOkAsync(result, ct);
    }
}