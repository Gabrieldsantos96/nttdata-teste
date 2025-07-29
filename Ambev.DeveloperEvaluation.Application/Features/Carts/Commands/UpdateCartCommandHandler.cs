using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using FluentValidation;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public sealed class UpdateCartCommandHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<UpdateCartCommand, MutationResult<Cart>>
{
    public async Task<MutationResult<Cart>> Handle(UpdateCartCommand input, CancellationToken ct)
    {
        var cart = await cartRepository.GetCartAsync(input.CartId, claimsService.GetUserRefId().ToString())
            ?? throw new NotFoundException($"Carrinho com ID {input.CartId} não encontrado para o usuário.");

        var cartItems = input.Command.Items
            .Select(item => CartItem.Create(item.ProductId, item.ProductName, item.Quantity))
            .ToList();

        cart.Update(claimsService.GetUserRefId().ToString(), cart.UserName, cartItems);

        new CartValidator().ValidateAndThrow(cart);

        await cartRepository.UpdateCartAsync(cart);

        return MutationResult<Cart>.Ok("Carrinho atualizado com sucesso", cart);

    }
}