using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Domain.Entities
{
    public class Cart : Entity
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public List<CartItem> Products { get; set; } = [];

        private Cart() { }

        public static Cart Create(string userId, string userName, List<CartItem> items)
        {
            var cart = new Cart
            {
                UserId = userId,
                UserName = userName,
            };

            new CartValidator().ValidateAndThrow(cart);

            return cart;
        }

        public void Update(string? userId = null, string? userName = null)
        {
            static T ThrowIfNull<T>(T? value, string propertyName) where T : class =>
                value ?? throw new DomainException(ValidationHelper.RequiredErrorMessage(propertyName));

            if (userId is not null)
                UserId = ThrowIfNull(userId, nameof(UserId));

            if (userName is not null)
                UserName = ThrowIfNull(userName, nameof(UserName));

            new CartValidator().ValidateAndThrow(this);
        }

        public void AddCartItem(CartItem item)
        {
            if (item == null)
                throw new DomainException(ValidationHelper.RequiredErrorMessage("item"));

            new CartItemValidator().ValidateAndThrow(item);

            var existingItem = Products.FirstOrDefault(i => i.ProductId == item.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += item.Quantity;
                new CartItemValidator().ValidateAndThrow(existingItem);
            }
            else
            {
                Products.Add(item);
            }
        }

        public void RemoveCartItem(string productId)
        {
            var item = Products.FirstOrDefault(i => i.ProductId == productId)
                ?? throw new DomainException($"Item with ProductId {productId} not found in cart.");

            Products.Remove(item);

            if (Products.Count == 0)
                throw new DomainException("O carrinho está vazio e deve ser removido.");
        }

        public void UpdateCartItem(string productId, int quantity)
        {
            var cartItem = Products.FirstOrDefault(i => i.ProductId == productId)
                ?? throw new DomainException($"Item with ProductId {productId} not found in cart.");

            cartItem.Quantity = quantity;

            new CartItemValidator().ValidateAndThrow(cartItem);
        }
    }

    public class CartItem : Entity
    {
        public string ProductId { get; set; } = null!;
        public string ProductName { get; set; } = null!;
        public int Quantity { get; set; }
        private CartItem() { }

        public static CartItem Create(string productId, string productName, int quantity, MoneyValue unitPrice)
        {
            var item = new CartItem
            {
                ProductId = productId,
                ProductName = productName,
                Quantity = quantity
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

            RuleForEach(x => x.Products).SetValidator(new CartItemValidator());
        }
    }

    public class CartItemValidator : AbstractValidator<CartItem>
    {
        public CartItemValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("ProductId"));

            RuleFor(x => x.ProductName)
                .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("ProductName"));

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("A quantidade deve ser maior que zero")
                .LessThanOrEqualTo(20).WithMessage("A quantidade máxima permitida por produto é 20");
        }
    }
}
