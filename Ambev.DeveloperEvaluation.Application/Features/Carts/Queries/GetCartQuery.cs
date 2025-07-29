using Ambev.DeveloperEvaluation.Domain.Entities;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Queries;
public record GetCartQuery(string CartId) : IRequest<Cart>;
