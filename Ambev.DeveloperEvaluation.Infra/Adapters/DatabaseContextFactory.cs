using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;

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
