using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Sales.Commands;
public sealed class CreateSaleCommand : IRequest<MutationResult<Sale>>
{
    public string CartId { get; set; } = null!;
};