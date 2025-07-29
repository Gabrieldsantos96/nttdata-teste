using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface IProductRepository
{
    Task<PaginatedResponse<Product>> GetPaginatedProductsAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default);

    Task<IList<Product>> GetProductAsync(IEnumerable<string> ids, CancellationToken ct = default);
    Task<GroupedPaginatedResponse<Product>> GetProductsGroupedByCategoryAsync(int skip = 0, int take = 20, CancellationToken ct = default);
    Task<Product> GetProductAsync(string id, CancellationToken ct = default);
    Task DeleteProductAsync(string id, CancellationToken ct = default);
    Task UpsertProductAsync(Product product, CancellationToken ct = default);
}