namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public sealed class SaleModifiedEvent(string saleNumber,string userEmail) : DomainEvent
{
    public string SaleNumber { get; set; } = saleNumber;
    public string UserEmail { get; set; } = userEmail;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}