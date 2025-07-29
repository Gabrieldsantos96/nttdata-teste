using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class CreateProductCommandHandler(IProductRepository productRepository, IClaimsService claimsService)
    : IRequestHandler<CreateProductCommand, MutationResult<Product>>
{
    public async Task<MutationResult<Product>> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var product = Product.Create(
            request.Title,
            new MoneyValue(request.Price),
            request.Description,
            request.Category,
            request.Image,
            new Rating(0, 0),
            claimsService.GetUserRefId().ToString()!
        );

        await productRepository.UpsertProductAsync(product);

        return MutationResult<Product>.Ok("Produto criado com sucesso", product);
    }
}
