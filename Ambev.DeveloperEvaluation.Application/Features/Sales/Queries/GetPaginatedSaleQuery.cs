using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
public record GetPaginatedSaleQuery(int Skip = 0, int Take = 20, string? Filter = null) : IRequest<PaginatedResponse<Sale>>;


