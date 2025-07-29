using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
public sealed class GetCartQueryHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<GetCartQuery, Cart>
{
    public Task<Cart> Handle(GetCartQuery input, CancellationToken ct)
    {
        var userRefId = claimsService.GetUserRefId().ToString();

        return cartRepository.GetCartAsync(input.CartId, userRefId, ct);
    }
}
