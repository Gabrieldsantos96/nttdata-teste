using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;
public sealed class UserRepository(IDatabaseContextFactory databaseContextFactory) : IUserRepository
{
    public async Task<User?> GetUserAsync(Guid refId, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        return await ctx.Users.AsNoTracking()
             .FirstOrDefaultAsync(u => u.RefId == refId, ct);
    }

    public async Task<User?> GetUserAsync(string email, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        return await ctx.Users.AsNoTracking()
             .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public Task<User> UpdateUserAsync(Guid refId, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

}
