using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Shared.Helpers;
using Ambev.DeveloperEvaluation.Shared.Validations;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Domain.Entities;

public sealed class SaleItem
{
    public string ProductId { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public int Quantity { get; set; }
    public MoneyValue UnitPrice { get; set; }
    public string Status { get; private set; } = SalesItemConsts.Active;
    public int DiscountPercentage
    {
        get
        {
            if (Quantity < 4)
                return 0;
            else if (Quantity >= 4 && Quantity < 10)
                return 10;
            else
                return 20;
        }
    }

    public MoneyValue TotalPriceWithDiscount =>
        UnitPrice * Quantity * (1 - DiscountPercentage / 100m);

    private SaleItem() { }

    public static SaleItem Create(string productId, string productName, int quantity, MoneyValue unitPrice)
    {
        var saleItem = new SaleItem
        {
            ProductId = productId,
            ProductName = productName,
            Quantity = quantity,
            UnitPrice = unitPrice
        };

        new SaleItemValidator().ValidateAndThrow(saleItem);

        return saleItem;
    }

    public void UpdateQuantity(int quantity)
    {
        Quantity = quantity;
        new SaleItemValidator().ValidateAndThrow(this);
    }

    public void Cancel()
    {
        Status = SalesItemConsts.Cancelled;
    }
}

public sealed class Sale : Entity, IHasDomainEvent
{
    public string SaleNumber { get; set; } = null!;
    public string CustomerId { get; set; } = null!;
    public string CustomerName { get; set; } = null!;
    public DateTime SaleDate { get; set; }
    public string Status { get; private set; } = SalesConsts.Pending;
    public List<SaleItem> Items { get; private set; } = [];
    public MoneyValue TotalAmount => MoneyValue.Sum([.. Items.Where(i => i.Status == SalesItemConsts.Active).Select(i => i.TotalPriceWithDiscount)]);
    public IList<DomainEvent> DomainEvents { get; } = [];
    private Sale() { }

    public static Sale Create(
        string customerId,
        string customerName,
        List<SaleItem> items)
    {
        var sale = new Sale
        {
            SaleNumber = CodeGenerator.GenerateCode<Sale>(),
            CustomerId = customerId,
            CustomerName = customerName,
            SaleDate = DateTime.UtcNow,
            Items = items ?? [],
            CreatedBy = customerId
        };

        new SaleValidator().ValidateAndThrow(sale);
        sale.DomainEvents.Add(new SaleCreatedEvent(sale.SaleNumber, sale.TotalAmount, sale.CustomerId));
        return sale;
    }

    private void CheckIfNotCompleted()
    {
        if (Status == SalesConsts.Completed)
            throw new DomainException("Não é possível modificar uma venda finalizada.");
    }

    public void UpdateItems(List<SaleItem> newItems, string userId)
    {
        CheckIfNotCompleted();

        var newItemsDictionary = newItems.ToDictionary(i => i.ProductId);

        foreach (var existing in Items.Where(i => i.Status == SalesItemConsts.Active && !newItemsDictionary.ContainsKey(i.ProductId)))
        {
            existing.Cancel();
            DomainEvents.Add(new ItemCancelledEvent(existing.ProductName, SaleNumber, userId));
        }

        foreach (var newItem in newItems)
        {
            var existing = Items.FirstOrDefault(i => i.ProductId == newItem.ProductId);

            if (existing is not null)
            {
                if (existing.Status == SalesItemConsts.Cancelled)
                {
                    throw new DomainException($"O item com ProductId '{newItem.ProductId}' está cancelado e não pode ser reativado ou recriado.");
                }
                existing.UpdateQuantity(newItem.Quantity);
                existing.ProductName = newItem.ProductName;
                existing.UnitPrice = newItem.UnitPrice;
            }
            else
            {
                Items.Add(SaleItem.Create(newItem.ProductId, newItem.ProductName, newItem.Quantity, newItem.UnitPrice));
            }
        }

        if (Items.All(i => i.Status == SalesItemConsts.Cancelled))
        {
            CancelSale(userId);
        }

        UpdatedBy = userId;

        DomainEvents.Add(new SaleModifiedEvent(Id, userId));

        new SaleValidator().ValidateAndThrow(this);
    }


    public void CancelSale(string userId)
    {
        CheckIfNotCompleted();

        Status = SalesConsts.Cancelled;
        foreach (var item in Items.Where(i => i.Status == SalesItemConsts.Active))
        {
            item.Cancel();
        }

        DomainEvents.Add(new SaleCancelledEvent(SaleNumber, userId));
    }

    public void CompleteSale(string userEmail)
    {
        CheckIfNotCompleted();

        if (Items.Any(i => i.Status == SalesItemConsts.Active))
        {
            Status = SalesConsts.Completed;
            new SaleValidator().ValidateAndThrow(this);
            DomainEvents.Add(new SaleCompletedEvent(SaleNumber, userEmail));
        }
        else
        {
            throw new DomainException("Cannot complete a sale with no active items.");
        }
    }
}

public sealed class SaleItemValidator : AbstractValidator<SaleItem>
{
    public SaleItemValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("ProductId"));

        RuleFor(x => x.ProductName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("ProductName"));

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("A quantidade deve ser maior que zero")
            .LessThanOrEqualTo(20).WithMessage("A quantidade máxima permitida por produto é 20");

        RuleFor(x => x.UnitPrice)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("UnitPrice"))
            .Must(x => (decimal)x >= 0).WithMessage("O preço unitário deve ser maior ou igual a zero");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Status"))
            .Must(status => new[] { "Active", "Cancelled" }.Contains(status))
            .WithMessage("O status do item deve ser 'Active' ou 'Cancelled'");
    }
}

public sealed class SaleValidator : AbstractValidator<Sale>
{
    public SaleValidator()
    {
        RuleFor(x => x.SaleNumber)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("SaleNumber"));

        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("CustomerId"));

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("CustomerName"));

        RuleFor(x => x.SaleDate)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("SaleDate"))
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("A data da venda não pode ser futura");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage(ValidationHelper.RequiredErrorMessage("Status"))
            .Must(status => new[] { "Pending", "Completed", "Cancelled" }.Contains(status))
            .WithMessage("O status deve ser 'Pending', 'Completed' ou 'Cancelled'");

        RuleFor(x => x.Items)
            .NotNull().WithMessage(ValidationHelper.RequiredErrorMessage("Items"))
            .Must(items => items != null && items.Count > 0 && items.Any(s => s.Status == SalesItemConsts.Active))
            .WithMessage("A venda deve ter pelo menos um item ativo, a menos que esteja cancelada.");

        RuleForEach(x => x.Items).SetValidator(new SaleItemValidator());
    }
}