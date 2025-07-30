using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FluentAssertions;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Tests.CustomerTests;
public class CustomerTest
{
    private const string ValidEmail = "testUser@example.com"; 
    private const string ValidUsername = "testUsername"; 
    private const string ValidFirstName = "Test"; 
    private const string ValidLastName = "User"; 
    private const string ValidPhone = "1234567890"; 
    private readonly Address ValidAddress = Address.Create("Test St", "12345-678", "Test City", "-23.5505,-46.6333", "123"); 
    private const string ValidRole = RoleConsts.Client;

    [Fact]
    public void Create_WithValidParameters_ShouldCreateCustomerSuccessfully()
    {
        var customer = Customer.Create(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, ValidAddress, ValidPhone);

        customer.Should().NotBeNull();
        customer.Email.Should().Be(ValidEmail);
        customer.Username.Should().Be(ValidUsername);
        customer.FirstName.Should().Be(ValidFirstName);
        customer.LastName.Should().Be(ValidLastName);
        customer.Address.Should().Be(ValidAddress);
        customer.Phone.Should().Be(ValidPhone);
        customer.Role.Should().Be(ValidRole);
    }

    [Theory]
    [InlineData("", ValidUsername, ValidFirstName, ValidLastName, ValidPhone, "o campo 'Email' é obrigatório")]
    [InlineData("invalid-email", ValidUsername, ValidFirstName, ValidLastName, ValidPhone, "O email deve ser válido")]
    [InlineData(ValidEmail, "", ValidFirstName, ValidLastName, ValidPhone, "o campo 'Nome de usuário' é obrigatório")]
    [InlineData(ValidEmail, ValidUsername, "", ValidLastName, ValidPhone, "o campo 'Primeiro nome' é obrigatório")]
    [InlineData(ValidEmail, ValidUsername, ValidFirstName, "", ValidPhone, "o campo 'Sobrenome' é obrigatório")]
    [InlineData(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, "", "o campo 'Telefone' é obrigatório")]
    public void Create_WithInvalidParameters_ShouldThrowValidationException(
        string email, string username, string firstName, string lastName, string phone, string expectedError)
    {
        Action act = () => Customer.Create(email, username, firstName, lastName, ValidAddress, phone);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().Contain(e => e.ErrorMessage == expectedError);
    }

    [Fact]
    public void Create_WithNullAddress_ShouldThrowValidationException()
    {
        Action act = () => Customer.Create(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, null!, ValidPhone);

        // Assert
        act.Should().Throw<ValidationException>()
           .And.Errors.Should().ContainSingle()
           .Which.ErrorMessage.Should().Be("o campo 'Endereço' é obrigatório");
    }

    [Fact]
    public void Update_WithValidParameters_ShouldUpdateFields()
    {
        var customer = Customer.Create(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, ValidAddress, ValidPhone);
        var newEmail = "newUserTest@example.com";
        var newUsername = "newUsername";
        var newFirstName = "newName";
        var newLastName = "newLastName";
        var newAddress = Address.Create("New Test St", "54321-876", "New Test City", "-23.5505,-46.6333", "456");
        var newPhone = "9876543210";
        var newRole = RoleConsts.Admin;

        customer.Update(newEmail, newUsername, newFirstName, newLastName, newAddress, newPhone, newRole);

        // Assert
        customer.Email.Should().Be(newEmail);
        customer.Username.Should().Be(newUsername);
        customer.FirstName.Should().Be(newFirstName);
        customer.LastName.Should().Be(newLastName);
        customer.Address.Should().Be(newAddress);
        customer.Phone.Should().Be(newPhone);
        customer.Role.Should().Be(newRole);
    }

    [Fact]
    public void Update_WithPartialParameters_ShouldUpdateOnlyProvidedFields()
    {
        var customer = Customer.Create(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, ValidAddress, ValidPhone);
        var newEmail = "newUserTest@example.com";
        var newFirstName = "newName";

        customer.Update(email: newEmail, firstName: newFirstName);

        // Assert
        customer.Email.Should().Be(newEmail);
        customer.FirstName.Should().Be(newFirstName);
        customer.Username.Should().Be(ValidUsername);
        customer.LastName.Should().Be(ValidLastName);
        customer.Address.Should().Be(ValidAddress);
        customer.Phone.Should().Be(ValidPhone);
        customer.Role.Should().Be(ValidRole);
    }

    [Theory]
    [InlineData("", null, null, null, null, null, null, "o campo 'Email' é obrigatório")]
    [InlineData("invalid-email", null, null, null, null, null, null, "O email deve ser válido")]
    [InlineData(ValidEmail, "", null, null, null, null, null, "o campo 'Nome de usuário' é obrigatório")]
    [InlineData(ValidEmail,ValidUsername, "", null, null, null, null, "o campo 'Primeiro nome' é obrigatório")]
    [InlineData(ValidEmail,ValidUsername, ValidFirstName, "", null, null, null, "o campo 'Sobrenome' é obrigatório")]
    [InlineData(ValidEmail,ValidUsername, ValidFirstName, ValidLastName, null, "", null, "o campo 'Telefone' é obrigatório")]
    [InlineData(ValidEmail,ValidUsername, ValidFirstName, ValidLastName, null, ValidPhone, "InvalidRole", $"A função deve ser uma das seguintes: {RoleConsts.Client}, {RoleConsts.Manager} ou {RoleConsts.Admin}")]
    public void Update_WithInvalidParameters_ShouldThrowValidationException(
        string? email, string? username, string? firstName, string? lastName, Address? address, string? phone, string? role, string expectedError)
    {
        var customer = Customer.Create(ValidEmail, ValidUsername, ValidFirstName, ValidLastName, ValidAddress, ValidPhone);

        Action act = () => customer.Update(email, username, firstName, lastName, address, phone, role);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().Contain(e => e.ErrorMessage == expectedError);
    }
}
