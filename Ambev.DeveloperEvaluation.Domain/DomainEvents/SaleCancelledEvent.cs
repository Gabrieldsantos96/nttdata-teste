namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class SaleCancelledEvent(String saleNumber, String userEmail) : DomainEvent
{
    public String SaleNumber { get; set; } = saleNumber;
    public String UserEmail { get; set; } = userEmail;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}