using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
public sealed class GetSaleQueryHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<GetSaleQuery, Cart>
{
    public Task<Cart> Handle(GetSaleQuery input, CancellationToken ct)
    {
        return cartRepository.GetCartAsync(input.CartId, claimsService.GetUserRefId().ToString());
    }
}
