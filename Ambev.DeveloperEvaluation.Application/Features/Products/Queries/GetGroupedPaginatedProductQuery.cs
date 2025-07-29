using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Products.Queries;
public record GetGroupedPaginatedProductQuery(int Skip = 0, int Take = 20) : IRequest<GroupedPaginatedResponse<Product>>;