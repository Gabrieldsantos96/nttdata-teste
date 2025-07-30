using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using FastEndpoints;
using MediatR;
using Ambev.DeveloperEvaluation.Application.Features.Users.Queries;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Users;

public sealed class GetPaginatedProductsEndpoint(IMediator mediator) : EndpointWithoutRequest<PaginatedResponse<User>>
{
    public override void Configure()
    {
        Get(ApiRoutes.Users.GetPaginatedUsers);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        int skip = Query<int>("skip", isRequired: false);
        int take = Query<int>("take", isRequired: false);
        string? filter = Query<string>("filter", isRequired: false);

        skip = skip < 0 ? 0 : skip;
        take = take <= 0 ? 10 : take;

        var result = await mediator.Send(new GetPaginatedUserQuery(skip, take, filter), ct);

        await SendOkAsync(result, ct);
    }
}