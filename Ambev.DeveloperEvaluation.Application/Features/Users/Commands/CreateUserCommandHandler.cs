using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
public sealed class CreateUserCommandHandler(IUserRepository userRepository)
    : IRequestHandler<CreateUserCommand, MutationResult<User>>
{
    public async Task<MutationResult<User>> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var user = User.Create(
            request.Email,
            request.UserName,
            request.Name,
            request.Phone, 
            request.Status,
            request.Role, 
            request.Street,
            request.Zipcode, 
            request.City,
            request.Geolocation, 
            request.Number
            );

        await userRepository.UpsertUserAsync(user, ct);

        return MutationResult<User>.Ok("Usuário criado com sucesso", user);
    }
}
