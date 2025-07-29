namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class ItemCancelledEvent(string productName,string saleNumber,string userId) : DomainEvent
{
    public string ProductName { get; set; } = productName;
    public string SaleNumber { get; set; } = saleNumber;
    public string UserId { get; set; } = userId;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}