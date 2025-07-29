using Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class UpdateSaleEndpoint(IMediator mediator) : Endpoint<UpdateCartDto, MutationResult<Cart>>
{
    public override void Configure()
    {
        Put(ApiRoutes.Carts.UpdateCart);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(UpdateCartDto req, CancellationToken ct)
    {
        var cartId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new UpdateCartCommand(req.Items, cartId!), ct);

        await SendOkAsync(result, ct);
    }
}