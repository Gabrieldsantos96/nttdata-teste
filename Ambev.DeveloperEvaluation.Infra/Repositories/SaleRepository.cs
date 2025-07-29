using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;

public sealed class SaleRepository(IDocumentStore documentStore) : ISaleRepository
{
    private readonly IDocumentStore _documentStore = documentStore;

    public async Task<Sale?> GetSaleAsync(string id)
    {
        using var session = _documentStore.OpenAsyncSession();
        return await session.LoadAsync<Sale>(id);
    }

    public async Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(string userId, int skip = 0, int take = 20, string? filter = null)
    {
        using var session = _documentStore.OpenAsyncSession();

        var query = session.Query<Sale>()
            .Where(s => s.CustomerId == userId)
            .OrderByDescending(s => s.CreatedAt);

        var paginatedTask = query.Skip(skip).Take(take).ToListAsync();
        var countTask = query.CountAsync();

        await Task.WhenAll(paginatedTask, countTask);

        var sales = paginatedTask.Result;
        var totalItems = countTask.Result;

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<Sale>(sales, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(int skip = 0, int take = 20, string? filter = null)
    {
        using var session = _documentStore.OpenAsyncSession();

        var query = session.Query<Sale>()
            .OrderByDescending(s => s.CreatedAt);

        var paginatedTask = query.Skip(skip).Take(take).ToListAsync();
        var countTask = query.CountAsync();

        await Task.WhenAll(paginatedTask, countTask);

        var sales = paginatedTask.Result;
        var totalItems = countTask.Result;

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<Sale>(sales, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task CreateSaleAsync(Sale sale, Cart cart)
    {
        using var session = _documentStore.OpenAsyncSession();
        session.Delete(cart);
        await session.StoreAsync(sale);

        await session.SaveChangesAsync();
    }


    public async Task UpdateSaleAsync(Sale sale)
    {
        using var session = _documentStore.OpenAsyncSession();
        await session.StoreAsync(sale);
        await session.SaveChangesAsync();
    }

    public async Task DeleteSaleAsync(string id, string userId)
    {
        using var session = _documentStore.OpenAsyncSession();
        var sale = await session.LoadAsync<Sale>(id) ?? throw new NotFoundException(nameof(Sale));
        sale.CancelSale(userId);
        await session.StoreAsync(sale);
        await session.SaveChangesAsync();
    }
}