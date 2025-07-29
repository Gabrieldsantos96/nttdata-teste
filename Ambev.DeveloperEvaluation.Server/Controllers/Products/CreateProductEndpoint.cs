using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class CreateProductEndpoint(IMediator mediator) : Endpoint<CreateProductDto, MutationResult<Product>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Products.CreateProduct);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }
    public override async Task HandleAsync(CreateProductDto req, CancellationToken ct)
    {
        var product = await mediator.Send(new CreateProductCommand()
        {
            Category = req.Category,
            Description = req.Description,
            Image = req.Image,
            Price = req.Price,
            RatingCount = req.RatingCount,
            RatingValue = req.RatingValue,
            Title = req.Title,
        }
        , ct);

        await SendOkAsync(product, ct);
    }
}