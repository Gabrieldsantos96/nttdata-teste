using Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class UpdateSaleEndpoint(IMediator mediator) : Endpoint<UpdateSaleDto, MutationResult<Sale>>
{
    public override void Configure()
    {
        Put(ApiRoutes.Carts.UpdateCart);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(UpdateSaleDto req, CancellationToken ct)
    {
        var saleId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new UpdateSaleCommand
        {
            SaleId = saleId!,
            Items = req.Items
        }, ct);

        await SendOkAsync(result, ct);
    }
}