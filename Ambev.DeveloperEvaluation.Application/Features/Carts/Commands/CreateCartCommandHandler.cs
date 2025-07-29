using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using FluentValidation;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;

public sealed class CreateCartCommandHandler(
    ICartRepository cartRepository,
    IClaimsService claimsService,
    IProductRepository productRepository)
    : IRequestHandler<CreateCartCommand, MutationResult<Cart>>
{
    public async Task<MutationResult<Cart>> Handle(CreateCartCommand input, CancellationToken ct)
    {
        var productIds = input.Items.Select(item => item.ProductId).Distinct().ToList();
        var existingProducts = await productRepository.GetProductAsync(productIds, ct);

        if (existingProducts.Count != productIds.Count)
        {
            var missingProductIds = productIds.Except(existingProducts.Select(p => p.Id)).ToList();
            throw new NotFoundException($"Os seguintes produtos foram excluídos ou não existem: {string.Join(", ", missingProductIds)}");
        }

        var cartItems = input.Items
            .Select(item => CartItem.Create(
                item.ProductId,
                existingProducts.First(p => p.Id == item.ProductId).Title,
                item.Quantity))
            .ToList();

        var cart = Cart.Create(
            userId: claimsService.GetUserRefId().ToString(),
            userName: claimsService.GetUsername(),
            products: cartItems);

        new CartValidator().ValidateAndThrow(cart);

        await cartRepository.CreateCartAsync(cart, ct);

        return MutationResult<Cart>.Ok("Carrinho criado com sucesso", cart);
    }
}