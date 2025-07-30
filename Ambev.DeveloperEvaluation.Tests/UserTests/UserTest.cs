using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FluentAssertions;
using FluentValidation;


namespace Ambev.DeveloperEvaluation.Tests.UserTests;

public class UserTest
{
    private static readonly Name ValidName = new("Test", "User");

    private static readonly Address ValidAddress = new()
    {
        City = "Test City",
        Geolocation = "12.3456,-65.4321",
        Number = "0001",
        Street = "Test St",
        Zipcode = "12345-678"
    };

    [Fact]
    public static void CreateUser_ShouldCreateUser_WhenValidParameters()
    {
        var email = "testUser01@example.com";
        var userName = "testUser01";
        var phone = "1234567890";
        var status = UserStatusConsts.ACTIVE;
        var role = RoleConsts.Client;
        
        var user = User.Create(email, userName, ValidName, ValidAddress, phone, status, role);

        // Assert
        user.Name.Should().NotBeNull();
        user.Email.Should().Be(email);
        user.UserName.Should().Be(userName);
        user.Name.Should().Be(ValidName);
        user.Address.Should().Be(ValidAddress);
        user.Phone.Should().Be(phone);
        user.Status.Should().Be(status);
        user.Role.Should().Be(role);
        user.RefId.Should().NotBeEmpty();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public static void OverloadCreateUser_ShouldCreateUser_WhenValidParameters()
    {
        var email = "testUser02@example.com";
        var userName = "testUser02";
        var phone = "1234567890";
        var status = UserStatusConsts.INACTIVE;
        var role = RoleConsts.Manager;
        var street = "Av. Test";
        var zipcode = "12345-678";
        var city = "Test City";
        var geo = "12.3456,-65.4321";
        var number = "0001";

        var user = User.Create(email, userName, ValidName, phone, status, role, street, zipcode, city, geo, number);

        // Assert
        user.Should().NotBeNull();
        user.Email.Should().Be(email);
        user.UserName.Should().Be(userName);
        user.Name.Should().Be(ValidName);
        user.Address.Street.Should().Be(street);
        user.Address.Zipcode.Should().Be(zipcode);
        user.Address.City.Should().Be(city);
        user.Address.Geolocation.Should().Be(geo);
        user.Address.Number.Should().Be(number);
        user.Phone.Should().Be(phone);
        user.Status.Should().Be(status);
        user.Role.Should().Be(role);
        user.RefId.Should().NotBeEmpty();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        user.LockoutEnabled.Should().BeFalse();
        user.EmailConfirmed.Should().BeTrue();
    }

    [Theory]
    [InlineData("", "userTest", "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client, "Email")]
    [InlineData("testUser02@example.com", "", "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client, "Nome de usuário")]
    [InlineData("testUser03@example.com", "userTest", "", UserStatusConsts.ACTIVE, RoleConsts.Client, "Telefone")]
    [InlineData("testUser04@example.com", "userTest", "1234567890", "InvalidStatus", RoleConsts.Client, "Status")]
    [InlineData("testUser05@example.com", "userTest", "1234567890", UserStatusConsts.ACTIVE, "InvalidRole", "Role")]
    public void Create_WithInvalidParameters_ShouldThrowValidationException(
    string email, string userName, string phone, string status, string role, string expectedError)
    {
        Action act = () => User.Create(email, userName, ValidName, ValidAddress, phone, status, role);

        // Assert
        act.Should().Throw<ValidationException>()
           .WithMessage($"*{expectedError}*");
    }

    [Fact]
    public void Create_WithInvalidEmailFormat_ShouldThrowValidationException()
    {
        var invalidEmail = "invalid-email";

        Action act = () => User.Create(invalidEmail, "testUsername", ValidName, ValidAddress, "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client);

        // Assert
        act.Should().Throw<ValidationException>()
           .WithMessage("*O email deve ser válido*");
    }

    [Fact]
    public void Update_WithValidParameters_ShouldUpdateFields()
    {
        var user = User.Create("testUser@example.com", "testUser", ValidName, ValidAddress, "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client);
        var newEmail = "newTestUser@example.com";
        var newUserName = "newUsername";
        var newName = new Name { FirstName = "New", LastName = "User" };
        var newAddress = Address.Create("New test St", "54321-876", "New test City", "-23.5505,-46.6333", "456");
        var newPhone = "9876543210";
        var newStatus = UserStatusConsts.INACTIVE;
        var newRole = RoleConsts.Manager;

        user.Update(newEmail, newUserName, newName, newAddress, newPhone, newStatus, newRole);

        // Assert
        user.Email.Should().Be(newEmail);
        user.UserName.Should().Be(newUserName);
        user.Name.Should().Be(newName);
        user.Address.Should().Be(newAddress);
        user.Phone.Should().Be(newPhone);
        user.Status.Should().Be(newStatus);
        user.Role.Should().Be(newRole);
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Update_WithPartialParameters_ShouldUpdateOnlyProvidedFields()
    {
        var user = User.Create("testUser01@example.com", "testUsername", ValidName, ValidAddress, "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client);
        var newEmail = "newTestUser01@example.com";
        var newPhone = "9876543210";

        user.Update(email: newEmail, phone: newPhone);

        // Assert
        user.Email.Should().Be(newEmail);
        user.Phone.Should().Be(newPhone);
        user.UserName.Should().Be("testUsername");
        user.Name.Should().Be(ValidName);
        user.Address.Should().Be(ValidAddress);
        user.Status.Should().Be(UserStatusConsts.ACTIVE);
        user.Role.Should().Be(RoleConsts.Client);
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("invalid-email", null, null, null, null, null, null, "O email deve ser válido")]
    [InlineData("", null, null, null, null, null, null, "Email")]
    [InlineData("testUser03@example.com", "", null, null, null, null, null, "Nome de usuário")]
    [InlineData("testUser04@example.com", "userTest", null, null, "", null, null, "Telefone")]
    [InlineData("testUser05@example.com", "userTest", null, null, "1234567890", "InvalidStatus", null, "Status")]
    [InlineData("testUser06@example.com", "userTest", null, null, "1234567890", UserStatusConsts.ACTIVE, "InvalidRole", "Função")]
    public void Update_WithInvalidParameters_ShouldThrowValidationException(
        string? email, string? userName, Name? name, Address? address, string? phone, string? status, string? role, string expectedError)
    {
        var user = User.Create("testUser@example.com", "testUser", ValidName, ValidAddress, "1234567890", UserStatusConsts.ACTIVE, RoleConsts.Client);

        Action act = () => user.Update(email, userName, name, address, phone, status, role);

        // Assert
        act.Should().Throw<ValidationException>()
           .WithMessage($"*{expectedError}*");
    }
}
