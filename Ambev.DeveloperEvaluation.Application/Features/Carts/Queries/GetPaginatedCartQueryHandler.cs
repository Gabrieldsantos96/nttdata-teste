using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
public sealed class GetPaginatedCartQueryHandler(ICartRepository cartRepository, IClaimsService claimsService) : IRequestHandler<GetPaginatedCartQuery, PaginatedResponse<Cart>>
{
    public Task<PaginatedResponse<Cart>> Handle(GetPaginatedCartQuery input, CancellationToken ct)
    {
        return cartRepository.GetPaginatedCartsAsync(claimsService.GetUserRefId().ToString(), input.Skip, input.Take, ct);
    }
}