namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class SaleModifiedEvent(string saleNumber,string userId) : DomainEvent
{
    public string SaleNumber { get; set; } = saleNumber;
    public string UserId { get; set; } = userId;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}