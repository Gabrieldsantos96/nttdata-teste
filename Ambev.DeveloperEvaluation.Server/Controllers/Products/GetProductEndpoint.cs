using Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;

public sealed class GetProductEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get(ApiRoutes.Products.GetProductById);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var productId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new GetProductQuery(productId!), cancellationToken: ct);

        await SendOkAsync(result, ct);
    }
}