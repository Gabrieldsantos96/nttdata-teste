using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class DeleteUserEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Delete(ApiRoutes.Users.DeleteUser);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = Route<Guid>("id", isRequired: true);

        await mediator.Send(new DeleteUserCommand
        {
            UserRefId = userId!
        }, ct);

        await SendNoContentAsync(ct);
    }
}