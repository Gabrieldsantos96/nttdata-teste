using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class CancelSaleCommand : IRequest
{
    public string SaleId { get; set; } = null!;
}
