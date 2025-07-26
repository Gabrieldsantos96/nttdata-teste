using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
{
    public DatabaseContext CreateDbContext(string[] args)
    {
        string connectionString = "Server=sqlserver;Database=AmbevDb;User Id=sa;Password=YourStrong@Passw0rd;MultipleActiveResultSets=True;TrustServerCertificate=True;";

        var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
        optionsBuilder.UseSqlServer(connectionString, builder =>
        {
            builder.EnableRetryOnFailure(3);
            builder.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
        });

        return new DatabaseContext(optionsBuilder.Options);
    }
}
