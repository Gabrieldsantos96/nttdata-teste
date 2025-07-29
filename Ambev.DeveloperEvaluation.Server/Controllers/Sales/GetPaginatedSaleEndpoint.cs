using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Sales;
public sealed class GetPaginatedSalesEndpoint(IMediator mediator) : Endpoint<PaginationDto, PaginatedResponse<Sale>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Sales.GetPaginatedSales);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(PaginationDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new GetPaginatedSaleQuery(req.Skip, req.Take, req.Filter), ct);

        await SendOkAsync(result, ct);
    }
}