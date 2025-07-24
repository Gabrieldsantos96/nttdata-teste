using System.Text.Json.Serialization;
using MediatR;

namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

[JsonPolymorphic]
[JsonDerivedType(typeof(SaleCancelledEvent), nameof(SaleCancelledEvent))]
[JsonDerivedType(typeof(ItemCancelledEvent), nameof(ItemCancelledEvent))]
[JsonDerivedType(typeof(SaleCreatedEvent), nameof(SaleCreatedEvent))]
[JsonDerivedType(typeof(SaleModifiedEvent), nameof(SaleModifiedEvent))]
public abstract class DomainEvent : INotification
{
    protected DomainEvent()
    {
        Type = GetType().FullName!;
    }

    public string Type { get; }
    public bool IsPublished { get; set; }
    public bool PublishToMessageBus { get; set; }
}
