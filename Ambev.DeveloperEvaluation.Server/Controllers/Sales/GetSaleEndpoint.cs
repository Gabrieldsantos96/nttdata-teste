using Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Sales;
public sealed class GetSaleEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get(ApiRoutes.Sales.GetSaleById);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var saleId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new GetSaleQuery(saleId!), cancellationToken: ct);

        await SendOkAsync(result, ct);
    }
}