using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
public sealed class GetProductQueryHandler(IProductRepository productRepository):IRequestHandler<GetProductQuery, Product>
{
    public Task<Product> Handle(GetProductQuery input, CancellationToken ct)
    {
        return productRepository.GetProductAsync(input.ProductId);
    }
}
