using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DatabaseContext>
{
    public DatabaseContext CreateDbContext(string[] args)
    {
        string connectionString = "Server=179.184.36.51;Database=Siproc_Dev;User Id=Siproc;Password=oL9273$Ys90dF60@;MultipleActiveResultSets=True;TrustServerCertificate=True;";

        var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
        optionsBuilder.UseSqlServer(connectionString, builder =>
        {
            builder.EnableRetryOnFailure(3);
            builder.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
        });

        return new DatabaseContext(optionsBuilder.Options);
    }
}
