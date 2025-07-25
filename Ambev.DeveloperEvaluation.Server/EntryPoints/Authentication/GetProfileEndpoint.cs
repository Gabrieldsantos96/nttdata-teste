using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.EntryPoints.Authentication;
public class GetProfileEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Post(ApiRoutes.Authentication.GetProfile);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Customer);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await mediator.Send(new GetProfileQuery(),cancellationToken: ct);

        await SendOkAsync(result, ct);
    }
}