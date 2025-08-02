using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Repositories;
public sealed class UserRepository(IDatabaseContextFactory databaseContextFactory) : IUserRepository
{
    public async Task<User?> GetUserAsync(Guid refId, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var result = await ctx.Users.AsNoTracking()
             .FirstOrDefaultAsync(u => u.RefId == refId, ct) ?? throw new NotFoundException(nameof(User));

        result.PasswordHash = "";
        return result;
    }

    public async Task<User?> GetUserAsync(string email, CancellationToken ct)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var result = await ctx.Users.AsNoTracking()
             .FirstOrDefaultAsync(u => u.Email == email, ct) ?? throw new NotFoundException(nameof(User));

        result.PasswordHash = "";

        return result;
    }

    public async Task<User?> GetUserAsync(string email, CancellationToken ct, bool withPassword = true)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var result = await ctx.Users.AsNoTracking()
             .FirstOrDefaultAsync(u => u.Email == email, ct) ?? throw new NotFoundException(nameof(User));

        return result;
    }

    public async Task<PaginatedResponse<User>> GetPaginatedUsersAsync(int skip = 0, int take = 20, string? filter = null, CancellationToken ct = default)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();

        var query = ctx.Users.AsNoTracking()
            .OrderByDescending(s => s.CreatedAt);

        var totalItems = await query.CountAsync(ct);
        var users = await query.Skip(skip).Take(take).ToListAsync(ct);

        foreach (var item in users)
        {
            item.PasswordHash = "";
        }

        var totalPages = (int)Math.Ceiling(totalItems / (double)take);

        return new PaginatedResponse<User>(users, totalItems, (int)Math.Ceiling((skip + 1) / (double)take), totalPages);
    }

    public async Task DeleteUserAsync(Guid userRefId)
    {
        await using var ctx = await databaseContextFactory.CreateDbContextAsync();
        var user = await ctx.Users.FirstOrDefaultAsync(u => u.RefId == userRefId);

        if (user is null)
            throw new NotFoundException(nameof(User));
        user.Status = UserStatusConsts.INACTIVE;
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
