using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public sealed class CreateCartCommandHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<CreateCartCommand, MutationResult<Cart>>
{
    public async Task<MutationResult<Cart>> Handle(CreateCartCommand input, CancellationToken ct)
    {
        var cartItems = input.Items.Select(s => CartItem.Create(s.ProductId, s.ProductName, s.Quantity)).ToList();

        var cart = Cart.Create(userId: claimsService.GetUserRefId().ToString(), userName: claimsService.GetUsername(), products: cartItems);

        var result = await cartRepository.CreateCartAsync(cart);

        return MutationResult<Cart>.Ok("Ok", cart);

    }
}
