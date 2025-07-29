using Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class CreateCartEndpoint(IMediator mediator) : Endpoint<CreateCartDto, MutationResult<Cart>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Carts.CreateCart);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }
    public override async Task HandleAsync(CreateCartDto req, CancellationToken ct)
    {
        var product = await mediator.Send(new CreateCartCommand(req.Items)
        , ct);

        await SendOkAsync(product, ct);
    }
}