using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public record UpdateCartItemDto(string ProductId,int Quantity);
public record UpdateCartDto(UpdateCartItemDto[] Items);
public record UpdateCartCommand(UpdateCartItemDto[] Items, string CartId) : IRequest<MutationResult<Cart>>;