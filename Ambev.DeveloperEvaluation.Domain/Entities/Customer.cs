using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Domain.Entities;
public sealed class Customer : Entity
{
    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public Address Address { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Role { get; set; } = RoleConsts.Client;
    public static Customer Create(string email, string username, string firstName, string lastName, Address address, string phone)
    {
        var customer = new Customer()
        {
            Address = address,
            Email = email,
            Username = username,
            FirstName = firstName,
            LastName = lastName,
            Phone = phone,
        };

        new CustomerValidator().ValidateAndThrow(customer);

        return customer;
    }
    public void Update(
    string? email = null,
    string? username = null,
    string? firstName = null,
    string? lastName = null,
    Address? address = null,
    string? phone = null,
    string? role = null)
    {
        static T ThrowIfNull<T>(T? value, string propertyName) where T : class =>
            value ?? throw new DomainException(ValidationHelper.RequiredErrorMessage(propertyName));

        if (email is not null)
            Email = ThrowIfNull(email, nameof(Email));

        if (username is not null)
            Username = ThrowIfNull(username, nameof(Username));

        if (firstName is not null)
            FirstName = ThrowIfNull(firstName, nameof(FirstName));

        if (lastName is not null)
            LastName = ThrowIfNull(lastName, nameof(LastName));

        if (address is not null)
            Address = ThrowIfNull(address, nameof(Address));

        if (phone is not null)
            Phone = ThrowIfNull(phone, nameof(Phone));

        if (role is not null)
            Role = ThrowIfNull(role, nameof(Role));

        new CustomerValidator().ValidateAndThrow(this);
    }
}
public sealed class CustomerValidator : AbstractValidator<Customer>
{
    public CustomerValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Email"))
            .EmailAddress().WithMessage("O email deve ser válido")
            .MaximumLength(255).WithMessage(ValidationHelper.MaxLengthErrorMessage("Email", 255));

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Nome de usuário"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Nome de usuário", 100));

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Primeiro nome"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Primeiro nome", 100));

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Sobrenome"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Sobrenome", 100));

        RuleFor(x => x.Address)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Endereço"));

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Telefone"))
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("Telefone", 20));

        RuleFor(x => x.Role)
        .Must(role => new[] { RoleConsts.Client, RoleConsts.Manager, RoleConsts.Admin }.Contains(role))
        .WithMessage($"A função deve ser uma das seguintes: {RoleConsts.Client}, {RoleConsts.Manager} ou {RoleConsts.Admin}");

    }
}