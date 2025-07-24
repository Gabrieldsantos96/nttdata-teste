using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class SaleCreatedEvent(string saleNumber, MoneyValue total, string userName) : DomainEvent
{
    public String UserName { get; set; } = userName;
    public MoneyValue Total { get; set; } = total;
    public String SaleNumber { get; set; } = saleNumber;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}