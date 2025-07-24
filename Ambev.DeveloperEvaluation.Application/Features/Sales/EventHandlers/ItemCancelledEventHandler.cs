using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.EventHandlers;
public class ItemCancelledEventHandler(IServiceScopeFactory serviceScopeFactory) : INotificationHandler<ItemCancelledEvent>
{
    public async Task Handle(ItemCancelledEvent notification, CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();

        var contextFactory = scope.ServiceProvider.GetRequiredService<IDatabaseContextFactory>();

        var context = await contextFactory.CreateDbContextAsync();

        Console.WriteLine($"Item with {notification.ProductName} from {notification.SaleNumber} was cancelled by {notification.UserEmail} at {notification.CreatedAt}.");
    }
}
