using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class DeleteProductCommandHandler(IProductRepository productRepository) : IRequestHandler<DeleteProductCommand>
{
    public async Task Handle(DeleteProductCommand input, CancellationToken ct)
    {
        await productRepository.DeleteProductAsync(input.ProductId, ct);

    }
}