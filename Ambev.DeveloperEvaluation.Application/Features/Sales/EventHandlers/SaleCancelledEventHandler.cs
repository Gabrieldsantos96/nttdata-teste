using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.EventHandlers;
public class SaleCancelledEventHandler(IServiceScopeFactory serviceScopeFactory) : INotificationHandler<SaleCancelledEvent>
{
    public async Task Handle(SaleCancelledEvent notification, CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();

        var contextFactory = scope.ServiceProvider.GetRequiredService<IDatabaseContextFactory>();

        var context = await contextFactory.CreateDbContextAsync();

        Console.WriteLine($"Sale {notification.SaleNumber} was cancelled by {notification.UserEmail} at {notification.CreatedAt}.");
    }
}
