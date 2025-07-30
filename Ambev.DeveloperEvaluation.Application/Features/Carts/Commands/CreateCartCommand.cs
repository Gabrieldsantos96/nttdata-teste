using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Carts.Commands;
public record CreateCartItemDto(string ProductId,int Quantity);
public record CreateCartDto(CreateCartItemDto[] Items);
public record CreateCartCommand(CreateCartItemDto[] Items) : IRequest<MutationResult<Cart>>;