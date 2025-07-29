using Ambev.DeveloperEvaluation.Domain.Entities;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
public record GetProductQuery(string ProductId) : IRequest<Product>;