using Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Sales;

public sealed class CreateProductEndpoint(IMediator mediator) : EndpointWithoutRequest<MutationResult<Sale>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Sales.CreateSale);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }
    public override async Task HandleAsync(CancellationToken ct)
    {
        var cartId = Route<string>("id", isRequired: true);

        var sale = await mediator.Send(new CreateSaleCommand()
        {
            CartId = cartId!
        }
        , ct);

        await SendOkAsync(sale, ct);
    }
}