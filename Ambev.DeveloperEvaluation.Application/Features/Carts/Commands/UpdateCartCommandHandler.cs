using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public sealed class UpdateCartCommandHandler(
    ICartRepository cartRepository,
    IProductRepository productRepository,
    IClaimsService claimsService) : IRequestHandler<UpdateCartCommand, MutationResult<Cart>>
{
    public async Task<MutationResult<Cart>> Handle(UpdateCartCommand input, CancellationToken ct)
    {
        var cart = await cartRepository.GetCartAsync(input.CartId, claimsService.GetUserRefId().ToString())
            ?? throw new NotFoundException($"Carrinho com ID {input.CartId} não encontrado para o usuário.");

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

        cart.Update(claimsService.GetUserRefId().ToString(), cart.UserName, cartItems);

        await cartRepository.UpdateCartAsync(cart, ct);

        return MutationResult<Cart>.Ok("Carrinho atualizado com sucesso", cart);
    }
}