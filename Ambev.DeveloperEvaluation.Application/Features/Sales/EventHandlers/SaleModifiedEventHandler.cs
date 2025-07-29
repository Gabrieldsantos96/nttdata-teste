using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.EventHandlers;
public class SaleModifiedEventHandler(IServiceScopeFactory serviceScopeFactory) : INotificationHandler<SaleModifiedEvent>
{
    public async Task Handle(SaleModifiedEvent notification, CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();

        var contextFactory = scope.ServiceProvider.GetRequiredService<IDatabaseContextFactory>();

        var context = await contextFactory.CreateDbContextAsync();

        Console.WriteLine($"Sale {notification.SaleNumber} was modified by {notification.UserId} at {notification.CreatedAt}.");
    }
}
