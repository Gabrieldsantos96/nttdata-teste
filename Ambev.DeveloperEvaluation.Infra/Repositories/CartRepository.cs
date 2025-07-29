using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;

public sealed class CartRepository(IDocumentStore documentStore) : ICartRepository
{
    public async Task<Cart> GetCartAsync(string id, string userId)
    {
        using var session = documentStore.OpenAsyncSession();

        return await session.Query<Cart>(id).FirstAsync(s => s.Id == id && s.CreatedBy == userId) ?? throw new NotFoundException(nameof(Cart));
    }

    public async Task<PaginatedResponse<Cart>> GetPaginatedCartsAsync(string userId, int skip = 0, int take = 20)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Cart>()
            .Where(s => s.CreatedBy == userId)
            .OrderByDescending(s => s.CreatedAt);

        var paginatedTask = query.Skip(skip).Take(take).ToListAsync();
        var countTask = query.CountAsync();

        await Task.WhenAll(paginatedTask, countTask);

        var carts = paginatedTask.Result;
        var totalItems = countTask.Result;

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<Cart>(carts, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task<Cart> CreateCartAsync(Cart cart)
    {
        using var session = documentStore.OpenAsyncSession();
        await session.StoreAsync(cart);
        await session.SaveChangesAsync();

        return cart;
    }

    public async Task<Cart> UpdateCartAsync(Cart cart)
    {
        using var session = documentStore.OpenAsyncSession();
        await session.StoreAsync(cart);
        await session.SaveChangesAsync();

        return cart;
    }

    public async Task DeleteCartAsync(string id)
    {
        using var session = documentStore.OpenAsyncSession();
        var cart = await session.LoadAsync<Cart>(id) ?? throw new NotFoundException(nameof(Cart));
        session.Delete(cart);
        await session.SaveChangesAsync();
    }
}
