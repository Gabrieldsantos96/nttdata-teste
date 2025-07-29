using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class GetGroupedPaginatedProductsEndpoint(IMediator mediator) : Endpoint<PaginationDto, GroupedPaginatedResponse<Product>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Products.GetGroupedPaginatedProducts);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(PaginationDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new GetGroupedPaginatedProductQuery(req.Skip, req.Take), ct);

        await SendOkAsync(result, ct);
    }
}