using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
public sealed class UpdateUserCommandHandler(IUserRepository userRepository) : IRequestHandler<UpdateUserCommand, MutationResult<User>>
{
    public async Task<MutationResult<User>> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        var existing = await userRepository.GetUserAsync(request.RefId, ct)
                       ?? throw new NotFoundException($"Usuário com Id '{request.RefId}' não encontrado.");

        var userAddress = new Address()
        {
            City = request.City,
            Geolocation = request.Geolocation,
            Number = request.Number, 
            Street = request.Street,
            Zipcode = request.Zipcode
        };

        existing.Update(
            request.Email,
            request.UserName,
            request.Name,
            userAddress,
            request.Phone,
            request.Status,
            request.Role
        );
        await userRepository.UpsertUserAsync(existing, ct);

        return MutationResult<User>.Ok("Usuário atualizado com sucesso", existing);
    }
}
