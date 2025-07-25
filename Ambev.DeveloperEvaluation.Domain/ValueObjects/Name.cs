
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Shared.Validations;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;

public sealed class Name : IEquatable<Name>
{
    public string FirstName { get; } = null!;
    public string LastName { get; } = null!;

    private const char Separator = '|'; // Separador para serialização

    public Name(string firstName, string lastName)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new DomainException(ValidationHelper.RequiredErrorMessage(firstName));
        if (firstName.Length > 100)
            throw new DomainException(ValidationHelper.MaxLengthErrorMessage("nome", 100));

        if (string.IsNullOrWhiteSpace(lastName))
            throw new DomainException(ValidationHelper.RequiredErrorMessage("sobrenome"));
        if (lastName.Length > 100)
            throw new DomainException(ValidationHelper.MaxLengthErrorMessage("sobrenome", 100));

        FirstName = firstName;
        LastName = lastName;
    }
    public string ToSerializedString() => $"{FirstName}{Separator}{LastName}";
    public static Name FromString(string serializedName)
    {
        if (string.IsNullOrWhiteSpace(serializedName))
            throw new DomainException(ValidationHelper.RequiredErrorMessage("nome completo"));

        var parts = serializedName.Split(Separator);
        if (parts.Length != 2)
            throw new DomainException("Formato de nome inválido. Use o formato 'firstName|lastName'.");

        return new Name(parts[0].Trim(), parts[1].Trim());
    }

    public override bool Equals(object? obj) => Equals(obj as Name);

    public bool Equals(Name? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return FirstName == other.FirstName && LastName == other.LastName;
    }

    public override int GetHashCode() => HashCode.Combine(FirstName, LastName);

    public static bool operator ==(Name? left, Name? right) => Equals(left, right);

    public static bool operator !=(Name? left, Name? right) => !Equals(left, right);

    public override string ToString() => $"{FirstName} {LastName}";
}