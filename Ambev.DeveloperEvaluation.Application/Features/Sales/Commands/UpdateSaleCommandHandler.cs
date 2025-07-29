using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class UpdateSaleCommandHandler(
    ISaleRepository saleRepository,
    IProductRepository productRepository,
    IClaimsService claimsService
) : IRequestHandler<UpdateSaleCommand, MutationResult<Sale>>
{
    public async Task<MutationResult<Sale>> Handle(UpdateSaleCommand input, CancellationToken ct)
    {
        var sale = await saleRepository.GetSaleAsync(input.SaleId)
            ?? throw new NotFoundException($"Venda com ID {input.SaleId} não encontrada.");

        var userRefId = claimsService.GetUserRefId().ToString();

        var itemTasks = input.Items.Select(async s =>
        {
            var product = await productRepository.GetProductAsync(s.ProductId)
                ?? throw new NotFoundException($"Produto com ID {s.ProductId} não encontrado.");

            return SaleItem.Create(s.ProductId, s.ProductName, s.Quantity, product.Price);
        });

        var updatedItems = await Task.WhenAll(itemTasks);

        sale.UpdateItems(updatedItems.ToList(), userRefId);

        await saleRepository.UpdateSaleAsync(sale);

        return MutationResult<Sale>.Ok("Venda atualizada com sucesso", sale);
    }
}
