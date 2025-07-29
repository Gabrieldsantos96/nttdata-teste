using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class UpdateSaleDto
{
    public List<UpdateSaleItemDto> Items { get; init; } = [];
}
public sealed class UpdateSaleCommand : IRequest<MutationResult<Sale>>
{
    public string SaleId { get; init; } = null!;
    public List<UpdateSaleItemDto> Items { get; init; } = [];
}
public sealed class UpdateSaleItemDto
{
    public string ProductId { get; init; } = null!;
    public string ProductName { get; init; } = null!;
    public int Quantity { get; init; }
}
