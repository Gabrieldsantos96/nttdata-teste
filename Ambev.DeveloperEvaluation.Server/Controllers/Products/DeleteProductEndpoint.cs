using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class DeleteProductEndpoint(IMediator mediator) : EndpointWithoutRequest
{
    public override void Configure()
    {
        Delete(ApiRoutes.Products.DeleteProduct);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var productId = Route<string>("id", isRequired: true);

        await mediator.Send(new DeleteProductCommand
        {
            ProductId = productId!
        }, ct);

        await SendNoContentAsync(ct);
    }
}