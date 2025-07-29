using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class DeleteProductCommand : IRequest
{
    public string ProductId { get; set; } = null!;
}