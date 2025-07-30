using Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class GetPaginatedCartsEndpoint(IMediator mediator) : EndpointWithoutRequest<PaginatedResponse<Cart>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Carts.GetPaginatedCarts);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        int skip = Query<int>("skip", isRequired: false);
        int take = Query<int>("take", isRequired: false);

        skip = skip < 0 ? 0 : skip;
        take = take <= 0 ? 10 : take;

        var result = await mediator.Send(new GetPaginatedCartQuery(skip, take), ct);

        await SendOkAsync(result, ct);
    }
}