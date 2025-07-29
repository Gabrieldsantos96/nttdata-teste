using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface ISaleRepository
{
    Task<Sale?> GetSaleAsync(string id, CancellationToken ct = default);
    Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default);
    Task<PaginatedResponse<Sale>> GetPaginatedSalesAsync(string userId, int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default);
    Task CreateSaleAsync(Sale sale, Cart cart, CancellationToken ct = default);
    Task UpdateSaleAsync(Sale sale, CancellationToken ct = default);
    Task DeleteSaleAsync(string saleId, string userId, CancellationToken ct = default);
}