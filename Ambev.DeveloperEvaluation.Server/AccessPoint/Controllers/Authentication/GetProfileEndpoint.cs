using Ambev.DeveloperEvaluation.Application.Features.Authentication.Queries;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.AccessPoint.Controllers.Authentication;
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