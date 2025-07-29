using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface ISaleRepository
{
    Task<Sale?> GetSaleAsync(string id);
    Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(int skip = 0, int take = 20, string? filter = null);
    Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(string userId, int skip = 0, int take = 20, string? filter = null);
    Task CreateSaleAsync(Sale sale, Cart cart);
    Task UpdateSaleAsync(Sale sale);
    Task DeleteSaleAsync(string saleId, string userId);
}