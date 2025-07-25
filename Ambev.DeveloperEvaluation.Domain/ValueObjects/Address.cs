using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;

[Owned]
public class Address
{
    [MaxLength(1000)]
    public required string Street { get; set; }

    [MaxLength(20)]
    public required string Zipcode { get; set; }

    public required int Number { get; set; }

    [MaxLength(100)]
    public required string City { get; set; }

    public required Geolocation Geolocation { get; set; }

    [SetsRequiredMembers]
    public Address(string street, string zipcode, int number, string city, Geolocation geolocation)
    {
        Street = street;
        Zipcode = zipcode.Replace("-", "");
        Number = number;
        City = city;
        Geolocation = geolocation;

        new AddressValidator().ValidateAndThrow(this);
    }
    public string ToJsonString()
    {
        return JsonSerializer.Serialize(this, new JsonSerializerOptions { WriteIndented = true });
    }
    public static Address FromJsonString(string json)
    {
        var address = JsonSerializer.Deserialize<Address>(json) ?? throw new DomainException(nameof(Address));
        new AddressValidator().ValidateAndThrow(address);
        return address;
    }
}

public class Geolocation
{
    [MaxLength(50)]
    public required string Lat { get; set; }

    [MaxLength(50)]
    public required string Long { get; set; }

    [SetsRequiredMembers]
    public Geolocation(string lat, string long_)
    {
        Lat = lat;
        Long = long_;
    }
}

public class AddressValidator : AbstractValidator<Address>
{
    public AddressValidator()
    {
        RuleFor(x => x.Street)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Endereço"))
            .MaximumLength(1000).WithMessage(ValidationHelper.MaxLengthErrorMessage("Endereço", 1000));

        RuleFor(x => x.Zipcode)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("CEP"))
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("CEP", 20));

        RuleFor(x => x.Number)
            .GreaterThanOrEqualTo(1).WithMessage(ValidationHelper.RequiredErrorMessage("Número"));

        RuleFor(x => x.City)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Cidade"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Cidade", 100));

        RuleFor(x => x.Geolocation)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Geolocalização"));

        RuleFor(x => x.Geolocation.Lat)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Latitude"))
            .MaximumLength(50).WithMessage(ValidationHelper.MaxLengthErrorMessage("Latitude", 50));

        RuleFor(x => x.Geolocation.Long)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Longitude"))
            .MaximumLength(50).WithMessage(ValidationHelper.MaxLengthErrorMessage("Longitude", 50));
    }
}