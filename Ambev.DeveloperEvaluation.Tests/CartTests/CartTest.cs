using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using FluentAssertions;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Tests.CartTests;
public class CartTest
{
    private readonly string _validUserId = "testUserId123"; 
    private readonly string _validUserName = "testUsername"; 
    private readonly string _validProductId = "testProductId123"; 
    private readonly string _validProductName = "Test Product Name"; 
    private readonly int _validQuantity = 5; 
    private readonly List<CartItem> _validCartItems = [CartItem.Create("testProductId123", "Test Product Name", 5)];

    [Fact]
    public void Cart_Create_WithValidParameters_ShouldCreateCartSuccessfully()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);

        // Assert
        cart.Should().NotBeNull();
        cart.UserId.Should().Be(_validUserId);
        cart.UserName.Should().Be(_validUserName);
        cart.Products.Should().BeEquivalentTo(_validCartItems);
        cart.CreatedBy.Should().Be(_validUserId);
    }

    [Theory]
    [InlineData("", "testUsername", "o campo 'UserId' é obrigatório")]
    [InlineData("testUserId123", "", "o campo 'UserName' é obrigatório")]
    public void Cart_Create_WithInvalidParameters_ShouldThrowValidationException(string userId, string userName, string expectedError)
    {
        Action act = () => Cart.Create(userId, userName, _validCartItems);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }

    [Fact]
    public void Cart_Create_WithNullProducts_ShouldThrowValidationException()
    {
        Action act = () => Cart.Create(_validUserId, _validUserName, null!);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().Contain(e => e.ErrorMessage == "o campo 'Items' é obrigatório");
    }

    [Fact]
    public void Cart_Create_WithEmptyProducts_ShouldThrowValidationException()
    {
        var emptyCartItems = new List<CartItem>();

        Action act = () => Cart.Create(_validUserId, _validUserName, emptyCartItems);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be("O carrinho deve ter pelo menos um item.");
    }

    [Fact]
    public void Cart_Update_WithValidParameters_ShouldUpdateFields()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);
        var newUserId = "newUserId456";
        var newUserName = "newUsername";
        var newCartItems = new List<CartItem>
        {
            CartItem.Create("newProduct123", "New Test Product", 3)
        };

        cart.Update(newUserId, newUserName, newCartItems);

        // Assert
        cart.UserId.Should().Be(newUserId);
        cart.UserName.Should().Be(newUserName);
        cart.Products.Should().BeEquivalentTo(newCartItems);
    }

    [Fact]
    public void Cart_Update_WithPartialParameters_ShouldUpdateOnlyProvidedFields()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);
        var newUserId = "newUserId456";

        cart.Update(newUserId, null!, null);

        // Assert
        cart.UserId.Should().Be(newUserId);
        cart.UserName.Should().Be(_validUserName);
        cart.Products.Should().BeEquivalentTo(_validCartItems);
    }

    [Fact]
    public void Cart_Update_WithExistingProduct_ShouldUpdateQuantity()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);
        var updatedCartItems = new List<CartItem>
        {
            CartItem.Create(_validProductId, _validProductName, 10)
        };

        cart.Update(_validUserId, _validUserName, updatedCartItems);

        // Assert
        cart.Products.Should().HaveCount(1);
        cart.Products[0].ProductId.Should().Be(_validProductId);
        cart.Products[0].ProductName.Should().Be(_validProductName);
        cart.Products[0].Quantity.Should().Be(10);
    }

    [Fact]
    public void Cart_Update_WithNewAndExistingProducts_ShouldUpdateAndAddItems()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);
        var newCartItems = new List<CartItem>
        {
            CartItem.Create(_validProductId, _validProductName, 10),
            CartItem.Create("newProduct123", "New Test Product", 3)
        };

        cart.Update(_validUserId, _validUserName, newCartItems);

        // Assert
        cart.Products.Should().HaveCount(2);
        cart.Products.Should().ContainSingle(i => i.ProductId == _validProductId && i.Quantity == 10);
        cart.Products.Should().ContainSingle(i => i.ProductId == "newProduct123" && i.Quantity == 3);
    }

    [Fact]
    public void Cart_Update_WithRemovingProducts_ShouldRemoveItems()
    {
        var cart = Cart.Create(_validUserId, _validUserName, [
            CartItem.Create(_validProductId, _validProductName, 5),
            CartItem.Create("prod456", "Laptop ABC", 3)
        ]);
        var updatedCartItems = new List<CartItem>
        {
            CartItem.Create("prod123", "Smartphone XYZ", 10)
        };
        
        cart.Update(_validUserId, _validUserName, updatedCartItems);

        // Assert
        cart.Products.Should().HaveCount(1);
        cart.Products.Should().ContainSingle(i => i.ProductId == "prod123" && i.Quantity == 10);
    }

    [Theory]
    [InlineData("", "testUsername", "o campo 'UserId' é obrigatório")]
    [InlineData("testUserId123", "", "o campo 'UserName' é obrigatório")]
    public void Cart_Update_WithInvalidParameters_ShouldThrowValidationException(string userId, string userName, string expectedError)
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);

        Action act = () => cart.Update(userId, userName, null);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }

    [Fact]
    public void Cart_Update_WithNullItemInList_ShouldThrowDomainException()
    {
        var cart = Cart.Create(_validUserId, _validUserName, _validCartItems);
        var invalidCartItems = new List<CartItem> { null! };

        Action act = () => cart.Update(_validUserId, _validUserName, invalidCartItems);

        // Assert
        act.Should().Throw<DomainException>()
            .WithMessage("o campo 'item' é obrigatório");
    }

    [Fact]
    public void CartItem_Create_WithValidParameters_ShouldCreateCartItemSuccessfully()
    {
        var cartItem = CartItem.Create(_validProductId, _validProductName, _validQuantity);

        // Assert
        cartItem.Should().NotBeNull();
        cartItem.ProductId.Should().Be(_validProductId);
        cartItem.ProductName.Should().Be(_validProductName);
        cartItem.Quantity.Should().Be(_validQuantity);
    }

    [Theory]
    [InlineData("", "Test Product Name", 5, "o campo 'ID do produto' é obrigatório")]
    [InlineData("testUserId123", "", 5, "o campo 'Nome do produto' é obrigatório")]
    [InlineData("testUserId123", "Test Product Name", 0, "A quantidade deve ser maior que zero")]
    [InlineData("testUserId123", "Test Product Name", 21, "A quantidade máxima permitida por produto é 20")]
    public void CartItem_Create_WithInvalidParameters_ShouldThrowValidationException(string productId, string productName, int quantity, string expectedError)
    {
        Action act = () => CartItem.Create(productId, productName, quantity);

        // Assert
        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }
}
