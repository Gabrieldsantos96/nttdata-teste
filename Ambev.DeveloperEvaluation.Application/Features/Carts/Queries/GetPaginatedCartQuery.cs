using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
public record GetPaginatedCartQuery(int Skip = 0, int Take = 20) : IRequest<PaginatedResponse<Cart>>;


