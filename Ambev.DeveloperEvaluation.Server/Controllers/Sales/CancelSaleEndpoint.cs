using Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Sales;
public sealed class CancelSaleEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Delete(ApiRoutes.Sales.DeleteSale);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var saleId = Route<string>("id", isRequired: true);

        await mediator.Send(new CancelSaleCommand
        {
            SaleId = saleId!
        }, ct);

        await SendNoContentAsync(ct);
    }
}