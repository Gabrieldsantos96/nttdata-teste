using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface IUserRepository
{
    Task<User?> GetUserAsync(Guid refId, CancellationToken ct);
    Task<User?> GetUserAsync(string email, CancellationToken ct);
    Task<User?> GetUserAsync(string email, CancellationToken ct, bool withPassword = true);
    Task<PaginatedResponse<User>> GetPaginatedUsersAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default);
    Task DeleteUserAsync(Guid userRefId);
    Task UpsertUserAsync(User user, CancellationToken ct);
}
