using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Ambev.DeveloperEvaluation.Domain.ValueObjects;

[Owned]
public class Address
{
    public string Street { get; set; } = null!;
    public string Zipcode { get; set; } = null!;
    public string Number { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Geolocation { get; set; } = null!;
    public static Address Create(string street, string zipcode, string number, string city, string geo)
    {
        var address = new Address
        {
            Street = street,
            Zipcode = zipcode,
            Number = number,
            City = city,
            Geolocation = geo
        };

        new AddressValidator().ValidateAndThrow(address);
        return address;
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

[Owned]
public record Geolocation(string Lat,string Long);
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
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("CEP"))
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("CEP", 20));

        RuleFor(x => x.City)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Cidade"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Cidade", 100));

        RuleFor(x => x.Geolocation)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Geolocalização"));

        RuleFor(x => x.Geolocation)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Latitude - Longitude"))
            .MaximumLength(50).WithMessage(ValidationHelper.MaxLengthErrorMessage("Latitude", 50));
    }
}