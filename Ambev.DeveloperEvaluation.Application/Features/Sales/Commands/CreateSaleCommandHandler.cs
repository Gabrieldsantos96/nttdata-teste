using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class CreateSaleCommandHandler(ISaleRepository saleRepository, ICartRepository cartRepository, IProductRepository productRepository, IClaimsService claimsService) : IRequestHandler<CreateSaleCommand, MutationResult<Sale>>
{
    public async Task<MutationResult<Sale>> Handle(CreateSaleCommand input, CancellationToken ct)
    {
        var userId = claimsService.GetUserRefId().ToString();
        var cart = await cartRepository.GetCartAsync(input.CartId, userId) ?? throw new NotFoundException($"Carrinho com ID {input.CartId} não encontrado para o usuário.");


        var productTasks = cart.Products.Select(async s =>
        {
            var product = await productRepository.GetProductAsync(s.ProductId) ?? throw new NotFoundException("Produto não encontrado");
            return SaleItem.Create(s.ProductId, s.ProductName, s.Quantity, product.Price);
        });

        var salesItems = await Task.WhenAll(productTasks);

        var sale = Sale.Create(cart.UserId, cart.UserName, [.. salesItems]);

        await saleRepository.CreateSaleAsync(sale, cart);

        return MutationResult<Sale>.Ok("Venda criada com sucesso", sale);

    }
}