using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using FluentAssertions;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Tests.ProductTests;

public class ProductTest
{
    private readonly MoneyValue _validPrice = new(1000);
    private readonly Rating _validRating = new(4, 100);
    private const string ValidTitle = "Test Item";
    private const string ValidCategory = "Test Category";
    private const string ValidDescription = "A perfect test item";
    private const string ValidImage = "https://example.com/testItem.jpg";
    private const string ValidUserId = "test-user-id";

    [Fact]
    public void Create_WithValidParameters_ShouldCreateProductSuccessfully()
    {
        var product = Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);

        product.Should().NotBeNull();
        product.Title.Should().Be(ValidTitle);
        product.Price.Should().Be(_validPrice);
        product.Description.Should().Be(ValidDescription);
        product.Category.Should().Be(ValidCategory);
        product.Image.Should().Be(ValidImage);
        product.Rating.Should().Be(_validRating);
        product.CreatedBy.Should().Be(ValidUserId);
    }

    [Theory]
    [InlineData("", ValidDescription, ValidCategory, ValidImage, "o campo 'Título' é obrigatório")]
    [InlineData(ValidTitle, "", ValidCategory, ValidImage, "o campo 'Descrição' é obrigatório")]
    [InlineData(ValidTitle, ValidDescription, "", ValidImage, "o campo 'Categoria' é obrigatório")]
    [InlineData(ValidTitle, ValidDescription, ValidCategory, "", "o campo 'Imagem' é obrigatório")]
    public void Create_WithInvalidParameters_ShouldThrowValidationException(
        string title, string description, string category, string image, string expectedError)
    {
        Action act = () => Product.Create(title, _validPrice, description, category, image, _validRating, ValidUserId);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }

    [Fact]
    public void Create_WithNullPrice_ShouldThrowValidationException()
    {
        var invalidPrice = new MoneyValue(0);

        Action act = () => Product.Create(ValidTitle, invalidPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be("o campo 'Preço' é obrigatório");
    }

    [Fact]
    public void Create_WithNullRating_ShouldThrowValidationException()
    {
        Action act = () => Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, null!, ValidUserId);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be("o campo 'Avaliação' é obrigatório");
    }

    [Theory]
    [InlineData(-1, 100, "A nota deve ser maior ou igual a zero")]
    [InlineData(6, 100, "A nota deve ser menor ou igual a 5")]
    [InlineData(4, -1, "A contagem de avaliações deve ser maior ou igual a zero")]
    public void Create_WithInvalidRatingValues_ShouldThrowValidationException(int rate, int count, string expectedError)
    {
        var invalidRating = new Rating(rate, count);

        Action act = () => Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, invalidRating, ValidUserId);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }

    [Fact]
    public void Update_WithValidParameters_ShouldUpdateFields()
    {
        var product = Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);
        var newTitle = "Smartphone Test";
        var newPrice = new MoneyValue(149);
        var newDescription = "A test smartphone";
        var newCategory = "Eletronics";
        var newImage = "https://example.com/smartphone-test.jpg";
        var newRating = new Rating(5, 200);

        product.Update(newTitle, newPrice, newDescription, newCategory, newImage, newRating);

        product.Title.Should().Be(newTitle);
        product.Price.Should().Be(newPrice);
        product.Description.Should().Be(newDescription);
        product.Category.Should().Be(newCategory);
        product.Image.Should().Be(newImage);
        product.Rating.Should().Be(newRating);
    }

    [Fact]
    public void Update_WithPartialParameters_ShouldUpdateOnlyProvidedFields()
    {
        var product = Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);
        var newTitle = "Smartphone Test";
        var newPrice = new MoneyValue(149);

        product.Update(title: newTitle, price: newPrice);

        product.Title.Should().Be(newTitle);
        product.Price.Should().Be(newPrice);
        product.Description.Should().Be(ValidDescription);
        product.Category.Should().Be(ValidCategory);
        product.Image.Should().Be(ValidImage);
        product.Rating.Should().Be(_validRating);
    }

    [Theory]
    [InlineData("", null, null, null, null, null, "o campo 'Título' é obrigatório")]
    [InlineData(ValidTitle, null, "", null, null, null, "o campo 'Descrição' é obrigatório")]
    [InlineData(ValidTitle, null, ValidDescription, "", null, null, "o campo 'Categoria' é obrigatório")]
    [InlineData(ValidTitle, null, ValidDescription, ValidCategory, "", null, "o campo 'Imagem' é obrigatório")]
    public void Update_WithInvalidParameters_ShouldThrowValidationException(
        string? title, MoneyValue? price, string? description, string? category, string? image, Rating? rating, string expectedError)
    {
        var product = Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);

        Action act = () => product.Update(title, price, description, category, image, rating);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }

    [Theory]
    [InlineData(-1, 100, "A nota deve ser maior ou igual a zero")]
    [InlineData(6, 100, "A nota deve ser menor ou igual a 5")]
    [InlineData(4, -1, "A contagem de avaliações deve ser maior ou igual a zero")]
    public void Update_WithInvalidRatingValues_ShouldThrowValidationException(int rate, int count, string expectedError)
    {
        var product = Product.Create(ValidTitle, _validPrice, ValidDescription, ValidCategory, ValidImage, _validRating, ValidUserId);
        var invalidRating = new Rating(rate, count);

        Action act = () => product.Update(rating: invalidRating);

        act.Should().Throw<ValidationException>()
            .And.Errors.Should().ContainSingle()
            .Which.ErrorMessage.Should().Be(expectedError);
    }
}
