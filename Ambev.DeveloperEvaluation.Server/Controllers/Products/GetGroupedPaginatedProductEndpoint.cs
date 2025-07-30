using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class GetGroupedPaginatedProductsEndpoint(IMediator mediator) : EndpointWithoutRequest<GroupedPaginatedResponse<Product>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Products.GetGroupedPaginatedProducts);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        int skip = Query<int>("skip", isRequired: false);
        int take = Query<int>("take", isRequired: false);

        skip = skip < 0 ? 0 : skip;
        take = take <= 0 ? 10 : take;

        var result = await mediator.Send(new GetGroupedPaginatedProductQuery(skip, take), ct);

        await SendOkAsync(result, ct);
    }
}