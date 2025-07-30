using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Commands;
public sealed class UpdateProductCommand : IRequest<MutationResult<Product>>
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public decimal Price { get; set; }
    public string Description { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string? Image { get; set; } = null!;

}