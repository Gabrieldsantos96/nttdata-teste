using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Sales;

public sealed class GetPaginatedSalesEndpoint(IMediator mediator) : EndpointWithoutRequest<PaginatedResponse<Sale>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Sales.GetPaginatedSales);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
        Description(b => b
            .Produces<PaginatedResponse<Sale>>(200)
            .ProducesProblem(400)
            .WithDescription("Obtém uma lista paginada de vendas com base nos parâmetros fornecidos."));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        int skip = Query<int>("skip", isRequired: false);
        int take = Query<int>("take", isRequired: false);
        string? filter = Query<string>("filter", isRequired: false);

        skip = skip < 0 ? 0 : skip;
        take = take <= 0 ? 10 : take;

        var result = await mediator.Send(new GetPaginatedSaleQuery(skip, take, filter), ct);

        await SendOkAsync(result, ct);
    }
}