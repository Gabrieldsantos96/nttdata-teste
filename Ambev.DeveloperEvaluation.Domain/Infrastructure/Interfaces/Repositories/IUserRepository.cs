using Ambev.DeveloperEvaluation.Domain.Entities;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
public interface IUserRepository
{
    Task<User?> GetUserAsync(Guid refId, CancellationToken ct);
    Task<User?> GetUserAsync(string email, CancellationToken ct);
    Task<User> UpdateUserAsync(Guid refId, CancellationToken ct);
}
