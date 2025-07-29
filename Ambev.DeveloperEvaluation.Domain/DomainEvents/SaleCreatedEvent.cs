using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class SaleCreatedEvent(string saleNumber, MoneyValue total, string userId) : DomainEvent
{
    public String UserId { get; set; } = userId;
    public MoneyValue Total { get; set; } = total;
    public String SaleNumber { get; set; } = saleNumber;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}