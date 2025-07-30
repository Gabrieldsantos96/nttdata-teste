using Ambev.DeveloperEvaluation.Domain.DomainEvents;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Consts;
using FluentAssertions;
using System.Collections.Generic;
using FluentValidation;

namespace Ambev.DeveloperEvaluation.Tests.SaleTests;
public class SaleTest
{
    private const string ValidCustomerId = "TestCustomerId123"; 
    private const string ValidCustomerName = "TestCustomerName"; 
    private const string ValidProductId = "TestProductId123"; 
    private const string ValidProductName = "Test Product Name"; 
    private const int ValidQuantity = 5; 
    private readonly MoneyValue ValidUnitPrice = new MoneyValue(100); 
    private readonly List<SaleItem> ValidItems = [SaleItem.Create(ValidProductId, ValidProductName, 5, new MoneyValue(100))]; 
    private const string ValidUserId = "TestUserId123";

    [Fact]
    public void SaleItem_Create_WithValidParameters_ShouldCreateSaleItemSuccessfully()
    {
        var saleItem = SaleItem.Create(ValidProductId, ValidProductName, ValidQuantity, ValidUnitPrice);

        // Assert
        saleItem.Should().NotBeNull();
        saleItem.ProductId.Should().Be(ValidProductId);
        saleItem.ProductName.Should().Be(ValidProductName);
        saleItem.Quantity.Should().Be(ValidQuantity);
        saleItem.UnitPrice.Should().Be(ValidUnitPrice);
        saleItem.Status.Should().Be(SalesItemConsts.Active);
        saleItem.DiscountPercentage.Should().Be(10); // 5 items -> 10% desconto
        saleItem.TotalPriceWithDiscount.Should().Be(ValidUnitPrice * ValidQuantity * 0.9m);
    }

    [Theory]
    [InlineData("", ValidProductName, 5, 100, "o campo 'ProductId' é obrigatório")]
    [InlineData(ValidProductId, "", 5, 100, "o campo 'ProductName' é obrigatório")]
    [InlineData(ValidProductId, ValidProductName, 0, 100, "A quantidade deve ser maior que zero")]
    [InlineData(ValidProductId, ValidProductName, 21, 100, "A quantidade máxima permitida por produto é 20")]
    [InlineData(ValidProductId, ValidProductName, 5, -1, "O preço unitário deve ser maior ou igual a zero")]
    public void SaleItem_Create_WithInvalidParameters_ShouldThrowValidationException(
        string productId, string productName, int quantity, decimal unitPriceAmount, string expectedError)
    {
        var unitPrice = new MoneyValue(unitPriceAmount);

        Action act = () => SaleItem.Create(productId, productName, quantity, unitPrice);

        // Assert
        act.Should().Throw<ValidationException>()
           .And.Errors.Should().Contain(e => e.ErrorMessage == expectedError);
    }

    [Fact]
    public void SaleItem_UpdateQuantity_WithValidQuantity_ShouldUpdateSuccessfully()
    {
        var saleItem = SaleItem.Create(ValidProductId, ValidProductName, ValidQuantity, ValidUnitPrice);
        var newQuantity = 8;

        saleItem.UpdateQuantity(newQuantity);

        // Assert
        saleItem.Quantity.Should().Be(newQuantity);
        saleItem.DiscountPercentage.Should().Be(10); // 8 items -> 10% desconto
        saleItem.TotalPriceWithDiscount.Should().Be(ValidUnitPrice * newQuantity * 0.9m);
    }

    [Theory]
    [InlineData(0, "A quantidade deve ser maior que zero")]
    [InlineData(21, "A quantidade máxima permitida por produto é 20")]
    public void SaleItem_UpdateQuantity_WithInvalidQuantity_ShouldThrowValidationException(int quantity, string expectedError)
    {
        var saleItem = SaleItem.Create(ValidProductId, ValidProductName, ValidQuantity, ValidUnitPrice);

        Action act = () => saleItem.UpdateQuantity(quantity);

        // Assert
        act.Should().Throw<ValidationException>()
           .And.Errors.Should().Contain(e => e.ErrorMessage == expectedError);
    }

    [Fact]
    public void SaleItem_Cancel_ShouldSetStatusToCancelled()
    {
        var saleItem = SaleItem.Create(ValidProductId, ValidProductName, ValidQuantity, ValidUnitPrice);

        saleItem.Cancel();

        // Assert
        saleItem.Status.Should().Be(SalesItemConsts.Cancelled);
    }

    [Fact]
    public void Sale_Create_WithValidParameters_ShouldCreateSaleSuccessfully()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);

        // Assert
        sale.Should().NotBeNull();
        sale.SaleNumber.Should().NotBeNullOrEmpty();
        sale.CustomerId.Should().Be(ValidCustomerId);
        sale.CustomerName.Should().Be(ValidCustomerName);
        sale.SaleDate.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        sale.Status.Should().Be(SalesConsts.Pending);
        sale.Items.Should().BeEquivalentTo(ValidItems);
        sale.TotalAmount.Should().Be(ValidItems[0].TotalPriceWithDiscount);
        sale.DomainEvents.Should().ContainSingle()
            .Which.Should().BeOfType<SaleCreatedEvent>()
            .Which.SaleNumber.Should().Be(sale.SaleNumber);
    }

    [Theory]
    [InlineData("", "John Doe", "o campo 'CustomerId' é obrigatório")]
    [InlineData("cust123", "", "o campo 'CustomerName' é obrigatório")]
    public void Sale_Create_WithInvalidParameters_ShouldThrowValidationException(string customerId, string customerName, string expectedError)
    {
        Action act = () => Sale.Create(customerId, customerName, ValidItems);

        // Assert
        act.Should().Throw<ValidationException>()
           .And.Errors.Should().Contain(e => e.ErrorMessage == expectedError);
    }

    [Fact]
    public void Sale_Create_WithEmptyItems_ShouldThrowValidationException()
    {
        var emptyItems = new List<SaleItem>();

        Action act = () => Sale.Create(ValidCustomerId, ValidCustomerName, emptyItems);

        // Assert
        act.Should().Throw<ValidationException>()
           .And.Errors.Should().Contain(e => e.ErrorMessage == "A venda deve ter pelo menos um item ativo, a menos que esteja cancelada.");
    }

    [Fact]
    public void Sale_UpdateItems_WithValidItems_ShouldUpdateItemsSuccessfully()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        var newItems = new List<SaleItem>
        {
            SaleItem.Create(ValidProductId, ValidProductName, 10, ValidUnitPrice),
            SaleItem.Create("prod456", "Laptop ABC", 3, new MoneyValue(200))
        };
        var updatedBy = ValidUserId;

        sale.UpdateItems(newItems, updatedBy);

        // Assert
        sale.Items.Should().HaveCount(2);
        sale.Items.Should().ContainSingle(i => i.ProductId == ValidProductId && i.Quantity == 10);
        sale.Items.Should().ContainSingle(i => i.ProductId == "prod456" && i.Quantity == 3);
        sale.TotalAmount.Should().Be(newItems[0].TotalPriceWithDiscount + newItems[1].TotalPriceWithDiscount);
        sale.DomainEvents.Should().ContainSingle(e => e is SaleModifiedEvent)
            .Which.Should().BeOfType<SaleModifiedEvent>()
            .Which.UserId.Should().Be(updatedBy);
    }

    [Fact]
    public void Sale_UpdateItems_WithCompletedSale_ShouldThrowDomainException()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        sale.CompleteSale(ValidUserId);
        var newItems = new List<SaleItem>
        {
            SaleItem.Create(ValidProductId, ValidProductName, 10, ValidUnitPrice)
        };

        Action act = () => sale.UpdateItems(newItems, ValidUserId);

        // Assert
        act.Should().Throw<DomainException>()
           .WithMessage("Não é possível modificar uma venda finalizada.");
    }

    [Fact]
    public void Sale_CancelSale_WithPendingSale_ShouldCancelSuccessfully()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        var userId = ValidUserId;

        sale.CancelSale(userId);

        // Assert
        sale.Status.Should().Be(SalesConsts.Cancelled);
        sale.Items.Should().AllSatisfy(i => i.Status.Should().Be(SalesItemConsts.Cancelled));
        sale.DomainEvents.Should().ContainSingle(e => e is SaleCancelledEvent)
            .Which.Should().BeOfType<SaleCancelledEvent>()
            .Which.UserId.Should().Be(userId);
    }

    [Fact]
    public void Sale_CancelSale_WithCompletedSale_ShouldThrowDomainException()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        sale.CompleteSale(ValidUserId);

        Action act = () => sale.CancelSale(ValidUserId);

        // Assert
        act.Should().Throw<DomainException>()
           .WithMessage("Não é possível modificar uma venda finalizada.");
    }

    [Fact]
    public void Sale_CompleteSale_WithActiveItems_ShouldCompleteSuccessfully()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        var userEmail = "user@example.com";

        sale.CompleteSale(userEmail);

        // Assert
        sale.Status.Should().Be(SalesConsts.Completed);
        sale.Items.Should().AllSatisfy(i => i.Status.Should().Be(SalesItemConsts.Active));
        sale.DomainEvents.Should().ContainSingle(e => e is SaleCompletedEvent)
            .Which.Should().BeOfType<SaleCompletedEvent>()
            .Which.UserEmail.Should().Be(userEmail);
    }

    [Fact]
    public void Sale_CompleteSale_WithNoActiveItems_ShouldThrowDomainException()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        sale.CancelSale(ValidUserId);

        Action act = () => sale.CompleteSale(ValidUserId);

        // Assert
        act.Should().Throw<DomainException>()
           .WithMessage("Cannot complete a sale with no active items.");
    }

    [Fact]
    public void Sale_CompleteSale_WithCompletedSale_ShouldThrowDomainException()
    {
        var sale = Sale.Create(ValidCustomerId, ValidCustomerName, ValidItems);
        sale.CompleteSale(ValidUserId);

        Action act = () => sale.CompleteSale(ValidUserId);

        // Assert
        act.Should().Throw<DomainException>()
           .WithMessage("Não é possível modificar uma venda finalizada.");
    }
}
