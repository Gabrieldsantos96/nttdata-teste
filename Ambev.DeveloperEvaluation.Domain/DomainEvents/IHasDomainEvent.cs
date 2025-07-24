namespace Ambev.DeveloperEvaluation.Domain.DomainEvents;

public interface IHasDomainEvent
{
    IList<DomainEvent> DomainEvents { get; }
}