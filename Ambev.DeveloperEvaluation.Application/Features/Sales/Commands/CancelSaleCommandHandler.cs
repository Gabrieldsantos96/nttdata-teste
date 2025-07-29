using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class CancelSaleCommandHandler(ISaleRepository saleRepository, IClaimsService claimsService) : IRequestHandler<CancelSaleCommand>
{
    public async Task Handle(CancelSaleCommand input, CancellationToken ct)
    {
        await saleRepository.DeleteSaleAsync(input.SaleId, claimsService.GetUserRefId().ToString(), ct);

    }
}