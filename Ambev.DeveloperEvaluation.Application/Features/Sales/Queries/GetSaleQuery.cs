using Ambev.DeveloperEvaluation.Domain.Entities;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Queries;
public record GetSaleQuery(string CartId) : IRequest<Cart>;
