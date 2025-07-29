using Ambev.DeveloperEvaluation.Domain.Exceptions;
using NodaMoney;
using System.Text.Json.Serialization;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;

public sealed class MoneyValue : IEquatable<MoneyValue>
{
    [JsonIgnore]
    public Money Value { get; }

    public decimal Amount { get; }
    public string Currency { get; }

    [JsonConstructor]
    public MoneyValue(decimal amount, string currency = "BRL")
    {
        Currency = currency ?? throw new ArgumentNullException(nameof(currency));
        Amount = amount;
        Value = new Money(amount, NodaMoney.Currency.FromCode(currency));
    }

    private MoneyValue(Money money)
    {
        Value = money;
        Amount = money.Amount;
        Currency = money.Currency.Code;
    }

    public override string ToString() => Value.ToString();

    public static implicit operator decimal(MoneyValue money) => money.Value.Amount;
    public static explicit operator Money(MoneyValue money) => money.Value;

    public static MoneyValue operator +(MoneyValue left, MoneyValue right)
    {
        if (left.Currency != right.Currency)
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
            return new MoneyValue(0, "BRL");

        var currency = values[0].Currency;
        var total = values.Aggregate(
            new Money(0, NodaMoney.Currency.FromCode(currency)),
            (acc, mv) =>
            {
                if (mv.Currency != currency)
                    throw new DomainException("All MoneyValues must have the same currency.");
                return acc + mv.Value;
            });

        return new MoneyValue(total);
    }
}
