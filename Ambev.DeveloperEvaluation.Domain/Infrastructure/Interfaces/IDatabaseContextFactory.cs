namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;

public interface IDatabaseContextFactory
{
    Task<IDatabaseContext> CreateDbContextAsync();
    IDatabaseContext CreateDbContext();

}
