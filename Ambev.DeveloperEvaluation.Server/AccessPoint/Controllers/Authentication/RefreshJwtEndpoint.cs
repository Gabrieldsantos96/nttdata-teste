using Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.AccessPoint.Controllers.Authentication;
public class RefreshJwtEndpoint(IMediator mediator) : Endpoint<RefreshJwtDto, MutationResult<RefreshTokenResult>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.RefreshJwt);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Customer);
    }
    public override async Task HandleAsync(RefreshJwtDto req, CancellationToken ct)
    {
        var refreshJwt = await mediator.Send(new RefreshJwtCommand(req.RefreshToken), ct);

        await SendOkAsync(refreshJwt, ct);
    }
}