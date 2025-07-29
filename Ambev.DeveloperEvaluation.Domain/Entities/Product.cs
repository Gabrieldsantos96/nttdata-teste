using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Domain.Entities;
public record Rating(int Rate, int Count);
public sealed class Product : Entity
{
    public string Title { get; set; } = null!;
    public MoneyValue Price { get; set; }
    public string Description { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Image { get; set; } = null!;
    public Rating Rating { get; set; } = null!;

    public static Product Create(
        string title,
        MoneyValue price,
        string description,
        string category,
        string image,
        Rating rating)
    {
        var product = new Product
        {
            Title = title,
            Price = price,
            Description = description,
            Category = category,
            Image = image,
            Rating = rating
        };

        new ProductValidator().ValidateAndThrow(product);
        return product;
    }

    public void Update(
        string? title = null,
        MoneyValue? price = null,
        string? description = null,
        string? category = null,
        string? image = null,
        Rating? rating = null)
    {
        static T ThrowIfNull<T>(T? value, string property) where T : class =>
            value ?? throw new DomainException($"O campo {property} não pode ser nulo.");

        if (title is not null)
            Title = ThrowIfNull(title, nameof(Title));

        if (price is not null)
            Price = price.Value;

        if (description is not null)
            Description = ThrowIfNull(description, nameof(Description));

        if (category is not null)
            Category = ThrowIfNull(category, nameof(Category));

        if (image is not null)
            Image = ThrowIfNull(image, nameof(Image));

        if (rating is not null)
            Rating = ThrowIfNull(rating, nameof(Rating));

        new ProductValidator().ValidateAndThrow(this);
    }
}
public sealed class ProductValidator : AbstractValidator<Product>
{
    public ProductValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Título"))
            .MaximumLength(200).WithMessage(ValidationHelper.MaxLengthErrorMessage("Título", 200));

        RuleFor(x => x.Price)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Preço"));

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Descrição"))
            .MaximumLength(1000).WithMessage(ValidationHelper.MaxLengthErrorMessage("Descrição", 1000));

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Categoria"))
            .MaximumLength(100).WithMessage(ValidationHelper.MaxLengthErrorMessage("Categoria", 100));

        RuleFor(x => x.Image)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Imagem"))
            .MaximumLength(500).WithMessage(ValidationHelper.MaxLengthErrorMessage("Imagem", 500));

        RuleFor(x => x.Rating)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Avaliação"));

        RuleFor(x => x.Rating.Rate)
            .GreaterThanOrEqualTo(0).WithMessage("A nota deve ser maior ou igual a zero")
            .LessThanOrEqualTo(5).WithMessage("A nota deve ser menor ou igual a 5");

        RuleFor(x => x.Rating.Count)
            .GreaterThanOrEqualTo(0).WithMessage("A contagem de avaliações deve ser maior ou igual a zero");
    }
}
