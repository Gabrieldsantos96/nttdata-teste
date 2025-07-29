using Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Carts;
public sealed class GetPaginatedCartsEndpoint(IMediator mediator) : Endpoint<PaginationDto, PaginatedResponse<Cart>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Carts.GetPaginatedCarts);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(PaginationDto req, CancellationToken ct)
    {
        var result = await mediator.Send(new GetPaginatedCartQuery(req.Skip, req.Take), ct);

        await SendOkAsync(result, ct);
    }
}