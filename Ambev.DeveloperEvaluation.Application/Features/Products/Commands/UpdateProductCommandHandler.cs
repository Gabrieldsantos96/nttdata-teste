using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class UpdateProductCommandHandler(IProductRepository productRepository)
    : IRequestHandler<UpdateProductCommand, MutationResult<Product>>
{
    public async Task<MutationResult<Product>> Handle(UpdateProductCommand request, CancellationToken ct)
    {
        var existing = await productRepository.GetProductAsync(request.Id, ct)
            ?? throw new NotFoundException($"Produto com ID '{request.Id}' não encontrado.");

        existing.Update(
            request.Title,
            new MoneyValue(request.Price),
            request.Description,
            request.Category,
            request.Image,
            new Rating(request.RatingRate, request.RatingCount)
        );

        await productRepository.UpsertProductAsync(existing, ct);

        return MutationResult<Product>.Ok("Produto atualizado com sucesso", existing);
    }
}