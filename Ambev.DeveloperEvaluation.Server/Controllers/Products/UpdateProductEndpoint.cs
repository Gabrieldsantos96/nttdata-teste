using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class UpdateProductEndpoint(IMediator mediator) : Endpoint<UpdateProductDto, MutationResult<Product>>
{
    public override void Configure()
    {
        Put(ApiRoutes.Products.UpdateProduct);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(UpdateProductDto req, CancellationToken ct)
    {
        var productId = Route<string>("id", isRequired: true);

        var result = await mediator.Send(new UpdateProductCommand
        {
            Id = productId!,
            Category = req.Category,
            Description = req.Description,
            Image = req.Image,
            Price = req.Price,
            RatingCount = req.RatingCount,
            RatingRate = req.RatingRate,
            Title = req.Title
        }, ct);

        await SendOkAsync(result, ct);
    }
}