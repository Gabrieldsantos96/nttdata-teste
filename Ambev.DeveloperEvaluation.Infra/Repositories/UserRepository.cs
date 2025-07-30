using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
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

    public async Task<PaginatedResponse<User>> GetPaginatedUsersAsync(int skip = 0, int take = 20, string? filter = null)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var query = ctx.Users.AsNoTracking()
            .OrderByDescending(s => s.CreatedAt);

        var paginatedTask = query.Skip(skip).Take(take).ToListAsync();
        var countTask = query.CountAsync();

        await Task.WhenAll(paginatedTask, countTask);

        var users = paginatedTask.Result;
        var totalItems = countTask.Result;

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<User>(users, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task DeleteUserAsync(Guid userRefId)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();
        var user = await ctx.Users.FirstOrDefaultAsync(u => u.RefId == userRefId);

        if (user is null)
            throw new NotFoundException(nameof(User));

        ctx.Users.Remove(user);
        await ctx.SaveChangesAsync();
    }

    public async Task UpsertUserAsync(User user, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var existing = await ctx.Users.AsNoTracking().FirstOrDefaultAsync(u => u.RefId == user.RefId, ct);

        if (existing is null)
        {
            await ctx.Users.AddAsync(user, ct);
        }
        else
        {
            existing.Update(
                user.Email,
                user.UserName,
                user.Name,
                user.Address,
                user.Phone,
                user.Status,
                user.Role
            );
        }

        await ctx.SaveChangesAsync(ct);
    }

}
