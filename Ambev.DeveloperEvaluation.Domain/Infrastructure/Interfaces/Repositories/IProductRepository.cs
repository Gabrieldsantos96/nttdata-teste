using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface IProductRepository
{
    Task<PaginatedResponse<Product>> GetPaginatedProductsAsync(int skip = 0, int take = 20, string? filter = null);
    Task<GroupedPaginatedResponse<Product>> GetProductsGroupedByCategoryAsync(int skip = 0, int take = 20);
    Task<Product> GetProductAsync(string id);
    Task DeleteProductAsync(string id);
    Task UpsertProductAsync(Product product);
}