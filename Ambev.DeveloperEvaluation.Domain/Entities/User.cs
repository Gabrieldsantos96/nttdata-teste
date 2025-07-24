using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Domain.Entities;

[Index(nameof(RefId), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(UserName), IsUnique = true)]
public class User : IdentityUser<int>
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid RefId { get; set; }
    public Name Name { get; set; }
    public Address Address { get; set; }
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Role { get; set; } = RoleConsts.Customer;

    private User() { }

    public static User Create(
        string email,
        string userName,
        Name name,
        Address address,
        string phone,
        string status,
        string role)
    {
        var user = new User
        {
            Email = email,
            UserName = userName,
            Name = name,
            Address = address,
            Phone = phone,
            Status = status,
            Role = role,
            RefId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        new UserValidator().ValidateAndThrow(user);
        return user;
    }

    public void Update(
        string? email = null,
        string? userName = null,
        Name? name = null,
        Address? address = null,
        string? phone = null,
        string? status = null,
        string? role = null)
    {
        static T ThrowIfNull<T>(T? value, string property) where T : class
            => value ?? throw new DomainException(ValidationHelper.RequiredErrorMessage(property));

        if (email is not null)
            Email = ThrowIfNull(email, nameof(Email));

        if (userName is not null)
            UserName = ThrowIfNull(userName, nameof(UserName));

        if (name is not null)
            Name = ThrowIfNull(name, nameof(Name));

        if (address is not null)
            Address = ThrowIfNull(address, nameof(Address));

        if (phone is not null)
            Phone = ThrowIfNull(phone, nameof(Phone));

        if (status is not null)
            Status = ThrowIfNull(status, nameof(Status));

        if (role is not null)
            Role = ThrowIfNull(role, nameof(Role));

        UpdatedAt = DateTime.UtcNow;

        new UserValidator().ValidateAndThrow(this);
    }
}
public class UserValidator : AbstractValidator<User>
{
    public UserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Email"))
            .EmailAddress().WithMessage("O email deve ser válido")
            .MaximumLength(256).WithMessage(ValidationHelper.MaxLengthErrorMessage("Email", 256));

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Nome de usuário"))
            .MaximumLength(256).WithMessage(ValidationHelper.MaxLengthErrorMessage("Nome de usuário", 256));

        RuleFor(x => x.Name)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Nome"));

        RuleFor(x => x.Name.FirstName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Primeiro nome"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Primeiro nome", 100));

        RuleFor(x => x.Name.LastName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Sobrenome"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Sobrenome", 100));

        RuleFor(x => x.Address)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Endereço"));

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Telefone"))
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("Telefone", 20));

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Status"))
            .Must(s => new[] { "Active", "Inactive", "Suspended" }.Contains(s))
            .WithMessage("O status deve ser Active, Inactive ou Suspended")
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("Status", 20));

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Função"))
            .Must(r => new[] { RoleConsts.Customer, RoleConsts.Manager, RoleConsts.Admin }.Contains(r))
            .WithMessage($"A função deve ser {RoleConsts.Customer}, {RoleConsts.Manager} ou {RoleConsts.Admin}")
            .MaximumLength(20).WithMessage(ValidationHelper.MaxLengthErrorMessage("Função", 20));

        RuleFor(x => x.RefId)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("RefId"));
    }
}