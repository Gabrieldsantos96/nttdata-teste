using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface ICartRepository
{
    Task<Cart> GetCartAsync(string id, string userId, CancellationToken ct = default);
    Task<PaginatedResponse<Cart>> GetPaginatedCartsAsync(string userId, int skip = 0, int take = 20, CancellationToken ct = default);
    Task<Cart> CreateCartAsync(Cart cart, CancellationToken ct = default);
    Task<Cart> UpdateCartAsync(Cart cart, CancellationToken ct = default);
    Task DeleteCartAsync(string id, CancellationToken ct = default);
}