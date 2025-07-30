using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;
using System.Globalization;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class UpdateProductEndpoint(IMediator mediator) : EndpointWithoutRequest<MutationResult<Product>>
{
    public override void Configure()
    {
        Put(ApiRoutes.Products.UpdateProduct);
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var productId = Route<string>("id", isRequired: true);

        if (Form.Count < 1)
        {
            throw new Exception(nameof(Product.Image));
        }

        var category = Form["category"];
        var description = Form["description"];
        var price = decimal.Parse(Form["price"]!, NumberStyles.Any, CultureInfo.InvariantCulture);
        var title = Form["title"];
        var image = Form["image"];

        var result = await mediator.Send(new UpdateProductCommand
        {
            Id = productId!,
            Category = category!,
            Description = description!,
            Image = image,
            Price = price!,
            Title = title!
        }, ct);

        await SendOkAsync(result, ct);
    }
}