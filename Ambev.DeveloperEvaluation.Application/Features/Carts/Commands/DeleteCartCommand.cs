using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public record DeleteCartCommand(string CartId) : IRequest<MutationResult<Cart>>;