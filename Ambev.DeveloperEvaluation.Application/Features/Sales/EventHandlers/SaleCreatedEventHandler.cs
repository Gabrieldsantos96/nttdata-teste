using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.EventHandlers;
public class SaleCreatedEventHandler(IServiceScopeFactory serviceScopeFactory) : INotificationHandler<SaleCreatedEvent>
{
    public async Task Handle(SaleCreatedEvent notification, CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();

        var contextFactory = scope.ServiceProvider.GetRequiredService<IDatabaseContextFactory>();

        var context = await contextFactory.CreateDbContextAsync();

        Console.WriteLine($"Sale {notification.SaleNumber} with total {notification.Total} was created by {notification.UserName} at {notification.CreatedAt}.");
    }
}
