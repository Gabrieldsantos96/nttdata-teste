using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class UpdateProductCommandHandler(
    IProductRepository productRepository,
    IFileStorageService storageService)
    : IRequestHandler<UpdateProductCommand, MutationResult<Product>>
{
    public async Task<MutationResult<Product>> Handle(UpdateProductCommand request, CancellationToken ct)
    {
        var existing = await productRepository.GetProductAsync(request.Id, ct)
            ?? throw new NotFoundException($"Produto com ID '{request.Id}' não encontrado.");

        string? imageUrl = existing.Image;

        if (!string.IsNullOrWhiteSpace(request.Image) && !request.Image.StartsWith("https", StringComparison.OrdinalIgnoreCase))
        {
            var (fileUrl, _) = await storageService.UploadFileAsync(request.Image, ct: ct);
            imageUrl = fileUrl;
        }

        existing.Update(
            title: request.Title,
            price: new MoneyValue(request.Price),
            description: request.Description,
            category: request.Category,
            rating: new Rating(0, 0),
            image: imageUrl
        );

        await productRepository.UpsertProductAsync(existing, ct);

        return MutationResult<Product>.Ok("Produto atualizado com sucesso", existing);
    }
}