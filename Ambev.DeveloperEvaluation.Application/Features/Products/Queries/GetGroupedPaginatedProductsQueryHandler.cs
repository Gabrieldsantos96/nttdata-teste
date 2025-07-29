
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
public sealed class GetGroupedPaginatedProductQueryHandler(IProductRepository productRepository) : IRequestHandler<GetGroupedPaginatedProductQuery, GroupedPaginatedResponse<Product>>
{
    public Task<GroupedPaginatedResponse<Product>> Handle(GetGroupedPaginatedProductQuery input, CancellationToken ct)
    {
        return productRepository.GetProductsGroupedByCategoryAsync(input.Skip, input.Take);
    }
}