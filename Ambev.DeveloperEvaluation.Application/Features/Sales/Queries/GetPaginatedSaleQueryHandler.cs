using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
public sealed class GetPaginatedSaleQueryHandler(ISaleRepository saleRepository) : IRequestHandler<GetPaginatedSaleQuery, PaginatedResponse<Sale>>
{
    public Task<PaginatedResponse<Sale>> Handle(GetPaginatedSaleQuery input, CancellationToken ct)
    {
        return saleRepository.GetPaginatedSalesAsync(input.Skip, input.Take, input.Filter);
    }
}