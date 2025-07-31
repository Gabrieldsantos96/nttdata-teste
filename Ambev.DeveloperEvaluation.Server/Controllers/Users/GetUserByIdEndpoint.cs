using Ambev.DeveloperEvaluation.Application.Features.Users.Queries;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Users;

public sealed class GetUserByIdEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get(ApiRoutes.Users.GetUserById);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = Route<Guid>("id", isRequired: true);

        var result = await mediator.Send(new GetUserQuery(userId!), cancellationToken: ct);

        await SendOkAsync(result, ct);
    }
}