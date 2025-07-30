using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Domain.Entities;

public class Cart : Entity
{
    public string UserId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public List<CartItem> Products { get; set; } = [];

    private Cart() { }

    public static Cart Create(string userId, string userName, List<CartItem> products)
    {
        var cart = new Cart
        {
            UserId = userId,
            UserName = userName,
            Products = products,
            CreatedBy = userId
        };

        new CartValidator().ValidateAndThrow(cart);

        return cart;
    }

    public void Update(string userId, string userName, List<CartItem>? items = null)
    {
        static T ThrowIfNull<T>(T? value, string propertyName) where T : class =>
            value ?? throw new DomainException(ValidationHelper.RequiredErrorMessage(propertyName));

        if (userId is not null)
            UserId = ThrowIfNull(userId, nameof(UserId));

        if (userName is not null)
            UserName = ThrowIfNull(userName, nameof(UserName));

        if (items != null)
        {
            UpdateCartItems(items);
        }

        new CartValidator().ValidateAndThrow(this);
    }

    private void UpdateCartItems(List<CartItem> newItems)
    {
        foreach (var item in newItems)
        {
            if (item == null)
                throw new DomainException(ValidationHelper.RequiredErrorMessage("item"));
            new CartItemValidator().ValidateAndThrow(item);
        }

        var newProductIds = newItems.Select(i => i.ProductId).ToHashSet();

        var removingList = Products.Where(i => !newProductIds.Contains(i.ProductId)).ToList();
        foreach (var item in removingList)
        {
            Products.Remove(item);
        }

        foreach (var newItem in newItems)
        {
            var existingItem = Products.FirstOrDefault(i => i.ProductId == newItem.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity = newItem.Quantity;
                new CartItemValidator().ValidateAndThrow(existingItem);
            }
            else
            {
                Products.Add(newItem);
            }
        }
    }
}

public class CartItem
{
    public string ProductId { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public int Quantity { get; set; }
    public string? Image { get; set; } = null!;
    private CartItem() { }

    public static CartItem Create(string productId, string productName, int quantity, string? imageUrl = null)
    {
        var item = new CartItem
        {
            ProductId = productId,
            ProductName = productName,
            Quantity = quantity,
            Image = imageUrl
        };

        new CartItemValidator().ValidateAndThrow(item);
        return item;
    }
}

public class CartValidator : AbstractValidator<Cart>
{
    public CartValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("UserId"));

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("UserName"));

        RuleFor(x => x.Products)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Items"))
            .Must(items => items != null && items.Count > 0).WithMessage("O carrinho deve ter pelo menos um item.");

        RuleFor(cart => cart.Products)
            .NotNull().WithMessage("Não pode nula")
            .Must(products => products == null || !products.GroupBy(p => p.ProductId).Any(g => g.Count() > 1))
            .WithMessage("Não pode ID duplicado");

        RuleForEach(x => x.Products).SetValidator(new CartItemValidator());
    }
}

public class CartItemValidator : AbstractValidator<CartItem>
{
    public CartItemValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("ID do produto"));

        RuleFor(x => x.ProductName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Nome do produto"));

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("A quantidade deve ser maior que zero")
            .LessThanOrEqualTo(20).WithMessage("A quantidade máxima permitida por produto é 20");
    }
}