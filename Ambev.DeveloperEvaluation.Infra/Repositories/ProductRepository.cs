using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;
public sealed class ProductRepository(IDocumentStore documentStore) : IProductRepository
{
    public async Task<PaginatedResponse<Product>> GetPaginatedProductsAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Product>()
            .OrderByDescending(s => s.CreatedAt);

        var products = await query.Skip(skip).Take(take).ToListAsync(ct);
        var totalItems = await query.CountAsync(ct);

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);
        var currentPage = (skip / take) + 1;

        return new PaginatedResponse<Product>(products, totalItems, currentPage, totalPages);
    }

    public async Task<GroupedPaginatedResponse<Product>> GetProductsGroupedByCategoryAsync(int skip = 0, int take = 20, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var products = await session.Query<Product>()
            .OrderBy(p => p.Category)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);

        var grouped = products
            .GroupBy(p => p.Category)
            .ToDictionary(
                g => g.Key ?? string.Empty,
                g => (IList<Product>)g.ToList()
            );

        var totalGroups = await session.Query<Product>()
            .Select(p => p.Category)
            .Distinct()
            .CountAsync(ct);

        var totalPages = (int)Math.Ceiling(totalGroups / (double)take);
        var currentPage = (skip / take) + 1;

        return new GroupedPaginatedResponse<Product>(grouped, totalGroups, currentPage, totalPages);
    }

    public async Task<Product> GetProductAsync(string id, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        return await session.LoadAsync<Product>(id, ct) ?? throw new NotFoundException(nameof(Product));
    }

    public async Task<IList<Product>> GetProductAsync(IEnumerable<string> ids, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        var products = await session.LoadAsync<Product>(ids, ct);
        return [.. products.Values.Where(p => p != null)];
    }

    public async Task DeleteProductAsync(string id, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var product = await session.LoadAsync<Product>(id) ?? throw new NotFoundException(nameof(Product));

        session.Delete(product);

        await session.SaveChangesAsync(ct);

    }

    public async Task UpsertProductAsync(Product product, CancellationToken ct = default)
    {

        using var session = documentStore.OpenAsyncSession();

        var existing = await session.LoadAsync<Product>(product.Id, ct);

        if (existing is null)
        {
            await session.StoreAsync(product);
        }
        else
        {
            existing.Update(
                product.Title,
                product.Price,
                product.Description,
                product.Category,
                product.Image,
                product.Rating
            );
        }

        await session.SaveChangesAsync(ct);
    }
}