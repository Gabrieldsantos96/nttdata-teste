using Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class GetCartEndpoint(IMediator mediator) : EndpointWithoutRequest<Cart>
{
    public override void Configure()
    {
        Get(ApiRoutes.Carts.GetCartById);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var cartId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new GetCartQuery(cartId!), ct);

        await SendOkAsync(result, ct);
    }
}