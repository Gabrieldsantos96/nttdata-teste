using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class GetPaginatedProductsEndpoint(IMediator mediator) : Endpoint<PaginationDto, PaginatedResponse<Product>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Products.GetPaginatedProducts);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(PaginationDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new GetPaginatedProductQuery(req.Skip, req.Take, req.Filter), ct);

        await SendOkAsync(result, ct);
    }
}