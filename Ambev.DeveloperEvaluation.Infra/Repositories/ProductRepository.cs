using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;
public sealed class ProductRepository(IDocumentStore documentStore) : IProductRepository
{
    public async Task<PaginatedResponse<Product>> GetPaginatedProductsAsync(int skip = 0, int take = 20, string? filter = null)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Product>()
            .OrderByDescending(s => s.CreatedAt);

        var paginatedTask = query.Skip(skip).Take(take).ToListAsync();
        var countTask = query.CountAsync();

        await Task.WhenAll(paginatedTask, countTask);

        var products = paginatedTask.Result;
        var totalItems = countTask.Result;

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<Product>(products, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task<GroupedPaginatedResponse<Product>> GetProductsGroupedByCategoryAsync(int skip = 0, int take = 20)
    {
        using var session = documentStore.OpenAsyncSession();


        var query = session.Query<Product>()
            .GroupBy(p => p.Category);

        var totalGroupsTask = query.CountAsync();

        var groupedResultsTask = query
            .Select(g => new { Key = g.Key, Products = g.ToList() })
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        await Task.WhenAll(totalGroupsTask, groupedResultsTask);

        var totalGroups = totalGroupsTask.Result;
        var groupedResults = groupedResultsTask.Result;

        var totalItems = totalGroupsTask.Result;

        var totalPages = (int)Math.Ceiling(totalGroups / (double)take);

        var result = groupedResults.ToDictionary(
            r => r.Key?.ToString() ?? string.Empty,
            r => (IList<Product>)[.. r.Products]
        );

        return new GroupedPaginatedResponse<Product>(result, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }
    public async Task<Product> GetProductAsync(string id)
    {
        using var session = documentStore.OpenAsyncSession();

        return await session.LoadAsync<Product>(id) ?? throw new NotFoundException(nameof(Product));
    }

    public async Task DeleteProductAsync(string id)
    {
        using var session = documentStore.OpenAsyncSession();

        var product = await session.LoadAsync<Product>(id) ?? throw new NotFoundException(nameof(Product));

        session.Delete(product);

        await session.SaveChangesAsync();

    }

    public async Task UpsertProductAsync(Product product)
    {

        using var session = documentStore.OpenAsyncSession();

        var existing = await session.LoadAsync<Product>(product.Id);

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

        await session.SaveChangesAsync();
    }
}