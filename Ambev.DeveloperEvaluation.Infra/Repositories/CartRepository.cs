using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Infra.Adapters;
using Raven.Client.Documents;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;

public sealed class CartRepository(IDocumentStore documentStore) : ICartRepository
{
    public async Task<Cart> GetCartAsync(string id, string userId, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var cart = await session.Query<Cart, Cart_ByIdAndUserId>()
            .Where(s => s.Id == id && s.UserId == userId)
            .FirstOrDefaultAsync(ct) ?? throw new NotFoundException(nameof(Cart));

        return cart;
    }
    public async Task<PaginatedResponse<Cart>> GetPaginatedCartsAsync(string userId, int skip = 0, int take = 20, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();

        var query = session.Query<Cart>()
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt);

        var carts = await query.Skip(skip).Take(take).ToListAsync();
        var totalItems = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);
        var currentPage = (skip / take) + 1;

        return new PaginatedResponse<Cart>(carts, totalItems, currentPage, totalPages);
    }

    public async Task<Cart> CreateCartAsync(Cart cart, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        await session.StoreAsync(cart, ct);
        await session.SaveChangesAsync(ct);

        return cart;
    }

    public async Task<Cart> UpdateCartAsync(Cart cart, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        await session.StoreAsync(cart, ct);
        await session.SaveChangesAsync(ct);

        return cart;
    }

    public async Task DeleteCartAsync(string id, CancellationToken ct = default)
    {
        using var session = documentStore.OpenAsyncSession();
        var cart = await session.LoadAsync<Cart>(id) ?? throw new NotFoundException(nameof(Cart));
        session.Delete(cart);
        await session.SaveChangesAsync(ct);
    }
}
