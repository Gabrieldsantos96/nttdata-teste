using Ambev.DeveloperEvaluation.Domain.Exceptions;
using NodaMoney;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;
public readonly struct MoneyValue : IEquatable<MoneyValue>
{
    private readonly Money _value;

    public MoneyValue(decimal amount, string currency = "BRL")
    {
        _value = new Money(amount, Currency.FromCode(currency));
    }

    public static implicit operator decimal(MoneyValue money) => money._value.Amount;

    public static explicit operator Money(MoneyValue money) => money._value;

    public override string ToString() => _value.ToString();

    public static MoneyValue operator +(MoneyValue left, MoneyValue right)
    {
        if (left._value.Currency != right._value.Currency)
            throw new InvalidOperationException("Cannot add money with different currencies");

        return new MoneyValue(left._value + right._value);
    }

    public static MoneyValue operator *(int multiplier, MoneyValue value)
        => new(value._value * multiplier);

    public static MoneyValue operator *(decimal multiplier, MoneyValue value)
        => new(value._value * multiplier);

    public static MoneyValue operator *(MoneyValue value, decimal multiplier)
        => new(value._value * multiplier);

    public static MoneyValue operator *(MoneyValue value, int multiplier)
        => new(value._value * multiplier);

    public static bool operator ==(MoneyValue left, MoneyValue right) => left.Equals(right);
    public static bool operator !=(MoneyValue left, MoneyValue right) => !(left == right);

    public bool Equals(MoneyValue other) => _value == other._value;

    public override bool Equals(object? obj) => obj is MoneyValue other && Equals(other);
    public override int GetHashCode() => _value.GetHashCode();
    public static MoneyValue Sum(params MoneyValue[] values)
    {
        if (values.Length == 0)
            return new MoneyValue(0);

        var currency = values[0]._value.Currency;
        var total = values.Aggregate(
            new Money(0, currency),
            (acc, mv) =>
            {
                if (mv._value.Currency != currency)
                    throw new DomainException("All MoneyValues must have the same currency.");
                return acc + mv._value;
            });

        return new MoneyValue(total.Amount, total.Currency.Code);
    }
    private MoneyValue(Money money)
    {
        _value = money;
    }
}
