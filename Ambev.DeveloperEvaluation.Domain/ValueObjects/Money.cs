using Ambev.DeveloperEvaluation.Domain.Exceptions;
using NodaMoney;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;
public sealed class MoneyValue : IEquatable<MoneyValue>
{
    public Money Value { get; set; }
    public MoneyValue(decimal amount, string currency = "BRL")
    {
        Value = new Money(amount, Currency.FromCode(currency));
    }

    public static implicit operator decimal(MoneyValue money) => money.Value.Amount;

    public static explicit operator Money(MoneyValue money) => money.Value;

    public override string ToString() => Value.ToString();

    public static MoneyValue operator +(MoneyValue left, MoneyValue right)
    {
        if (left.Value.Currency != right.Value.Currency)
            throw new InvalidOperationException("Cannot add money with different currencies");

        return new MoneyValue(left.Value + right.Value);
    }

    public static MoneyValue operator *(int multiplier, MoneyValue value)
        => new(value.Value * multiplier);

    public static MoneyValue operator *(decimal multiplier, MoneyValue value)
        => new(value.Value * multiplier);

    public static MoneyValue operator *(MoneyValue value, decimal multiplier)
        => new(value.Value * multiplier);

    public static MoneyValue operator *(MoneyValue value, int multiplier)
        => new(value.Value * multiplier);

    public static bool operator ==(MoneyValue left, MoneyValue right) => left.Equals(right);
    public static bool operator !=(MoneyValue left, MoneyValue right) => !(left == right);

    public bool Equals(MoneyValue other) => Value == other.Value;

    public override bool Equals(object? obj) => obj is MoneyValue other && Equals(other);
    public override int GetHashCode() => Value.GetHashCode();
    public static MoneyValue Sum(params MoneyValue[] values)
    {
        if (values.Length == 0)
            return new MoneyValue(0);

        var currency = values[0].Value.Currency;
        var total = values.Aggregate(
            new Money(0, currency),
            (acc, mv) =>
            {
                if (mv.Value.Currency != currency)
                    throw new DomainException("All MoneyValues must have the same currency.");
                return acc + mv.Value;
            });

        return new MoneyValue(total.Amount, total.Currency.Code);
    }
    private MoneyValue(Money money)
    {
        Value = money;
    }
}
