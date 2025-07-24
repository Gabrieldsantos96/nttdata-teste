namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class ItemCancelledEvent(String productName,string saleNumber,String userEmail) : DomainEvent
{
    public String ProductName { get; set; } = productName;
    public String SaleNumber { get; set; } = saleNumber;
    public String UserEmail { get; set; } = userEmail;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}