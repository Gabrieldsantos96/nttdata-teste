using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public sealed class DeleteCartCommandHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<DeleteCartCommand, MutationResult<Cart>>
{
    public async Task<MutationResult<Cart>> Handle(DeleteCartCommand input, CancellationToken ct)
    {
        var cart = await cartRepository.GetCartAsync(input.CartId, claimsService.GetUserRefId().ToString())
            ?? throw new NotFoundException($"Carrinho com ID {input.CartId} não encontrado para o usuário.");

        await cartRepository.DeleteCartAsync(input.CartId, ct);

        return MutationResult<Cart>.Ok("Carrinho excluído com sucesso", cart);
    }
}