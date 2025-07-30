using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Exceptions;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Queries;
public sealed class GetUserQueryHandler(IUserRepository userRepository) : IRequestHandler<GetUserQuery, User>
{
    public async Task<User> Handle(GetUserQuery input, CancellationToken ct)
    {
        var user = await userRepository.GetUserAsync(input.UserRefId, ct);

        if (user is null)
            throw new NotFoundException($"Usuário com o RefId: {input.UserRefId} não foi encontrado!");

        return user;
    }
}
