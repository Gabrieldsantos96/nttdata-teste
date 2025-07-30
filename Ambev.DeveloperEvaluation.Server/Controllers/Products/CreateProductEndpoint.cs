using Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Models;
using FastEndpoints;
using MediatR;
using System.Globalization;

namespace Ambev.DeveloperEvaluation.Server.Controllers.Products;
public sealed class CreateProductEndpoint(IMediator mediator) : EndpointWithoutRequest<MutationResult<Product>>
{
    public override void Configure()
    {
        Post(ApiRoutes.Products.CreateProduct);
        AllowFileUploads();
        Roles(RoleConsts.Manager, RoleConsts.Admin, RoleConsts.Client);
    }
    public override async Task HandleAsync(CancellationToken ct)
    {

        if (Form.Count < 1) {
            throw new Exception(nameof(Product.Image));
        }

        var category = Form["category"];
        var description = Form["description"];
        var price = decimal.Parse(Form["price"]!, NumberStyles.Any, CultureInfo.InvariantCulture);
        var title = Form["title"];
        var image = Form["image"];

        var product = await mediator.Send(new CreateProductCommand()
        {
            Category = category!,
            Description = description!,
            Price = price,
            Title = title!,
            Image = image!

        }
        , ct);

        await SendOkAsync(product, ct);
    }
}