using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface ICartRepository
{
    Task<Cart> GetCartAsync(string id, string userId);
    Task<PaginatedResponse<Cart>> GetPaginatedCartsAsync(string userId, int skip = 0, int take = 20);
    Task<Cart> CreateCartAsync(Cart cart);
    Task<Cart> UpdateCartAsync(Cart cart);
    Task DeleteCartAsync(string id);
}