using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public static class RavenDbContext
{
    public static IDocumentStore CreateDocumentStore(string databaseName, string serverUrl)
    {
        var store = new DocumentStore
        {
            Urls = new[] { serverUrl },
            Database = databaseName
        };

        store.Initialize();

        return store;
    }

    public static IDocumentSession OpenSession(this IAsyncDocumentSession store) =>
        store.OpenSession();
    public static async Task SeedDatabase(IDocumentStore store)
    {
        using var session = store.OpenAsyncSession();

        var products = GenerateProducts();
        foreach (var product in products)
        {
            await session.StoreAsync(product);
        }

        await session.SaveChangesAsync();
        Console.WriteLine($"{products.Count} produtos inseridos com sucesso.");
    }
    public static List<Product> GenerateProducts()
    {
        var categories = new[] { "Roupas", "Calçados", "Acessórios" };
        var random = new Random();
        var products = new List<Product>();

        for (int i = 1; i <= 20; i++)
        {
            var product = new Product
            {
                Title = $"Produto {i} - {(i % 2 == 0 ? "Camisa" : i % 3 == 0 ? "Tênis" : "Acessório")}",
                Price = new MoneyValue((decimal)(50 + random.NextDouble() * 150), "BRL"),
                Description = $"Descrição detalhada do item {i}, ideal para uso diário.",
                Category = categories[random.Next(categories.Length)],
                Image = $"https://example.com/images/product{i}.jpg",
                Rating = new Rating(random.Next(0, 100), (int)(random.NextDouble() * 5)),
            };
            products.Add(product);
        }

        return products;
    }
}