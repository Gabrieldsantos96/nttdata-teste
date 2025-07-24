using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Data;

public class DatabaseContextFactory(IDbContextFactory<DatabaseContext> databaseContextFactory) : IDatabaseContextFactory
{
    public async Task<IDatabaseContext> CreateDbContextAsync()
    {
        return await databaseContextFactory.CreateDbContextAsync();
    }
    public IDatabaseContext CreateDbContext()
    {
        return databaseContextFactory.CreateDbContext();
    }
}
