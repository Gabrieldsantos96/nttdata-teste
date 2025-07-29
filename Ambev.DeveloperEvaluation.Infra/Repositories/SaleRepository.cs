using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;

public sealed class SaleRepository(IDocumentStore documentStore) : ISaleRepository
{
    public async Task<Sale?> GetSaleAsync(string id, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        return await session.LoadAsync<Sale>(id,ct);
    }

    public async Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(string userId, int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Sale>()
            .Where(s => s.CustomerId == userId)
            .OrderByDescending(s => s.CreatedAt);

        var sales = await query.Skip(skip).Take(take).ToListAsync(ct);
        var totalItems = await query.CountAsync(ct);

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);
        var currentPage = (skip / take) + 1;

        return new PaginatedResponse<Sale>(sales, totalItems, currentPage, totalPages);
    }

    public async Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Sale>()
            .OrderByDescending(s => s.CreatedAt);

        var sales = await query.Skip(skip).Take(take).ToListAsync(ct);
        var totalItems = await query.CountAsync(ct);

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);
        var currentPage = (skip / take) + 1;

        return new PaginatedResponse<Sale>(sales, totalItems, currentPage, totalPages);
    }

    public async Task CreateSaleAsync(Sale sale, Cart cart, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        session.Delete(cart.Id);
        await session.StoreAsync(sale);

        await session.SaveChangesAsync(ct);
    }


    public async Task UpdateSaleAsync(Sale sale, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        await session.StoreAsync(sale);
        await session.SaveChangesAsync(ct);
    }

    public async Task DeleteSaleAsync(string id, string userId, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        var sale = await session.LoadAsync<Sale>(id) ?? throw new NotFoundException(nameof(Sale));
        sale.CancelSale(userId);
        await session.StoreAsync(sale);
        await session.SaveChangesAsync(ct);
    }
}