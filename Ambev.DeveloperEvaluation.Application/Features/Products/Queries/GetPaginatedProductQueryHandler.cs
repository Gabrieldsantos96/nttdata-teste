using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
public sealed class GetPaginatedProductQueryHandler(IProductRepository productRepository) : IRequestHandler<GetPaginatedProductQuery, PaginatedResponse<Product>>
{
    public Task<PaginatedResponse<Product>> Handle(GetPaginatedProductQuery input, CancellationToken ct)
    {
        return productRepository.GetPaginatedProductsAsync(input.Skip, input.Take, input.Filter);
    }
}