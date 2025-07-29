using Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class DeleteCartEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Delete(ApiRoutes.Carts.DeleteCart);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var cartId = Route<string>("id", isRequired: true);

        await mediator.Send(new DeleteCartCommand(cartId!), ct);

        await SendNoContentAsync(ct);

    }
}
