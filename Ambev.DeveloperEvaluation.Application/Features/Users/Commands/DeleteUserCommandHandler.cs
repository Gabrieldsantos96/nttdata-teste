using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
public sealed class DeleteUserCommandHandler(IUserRepository userRepository) : IRequestHandler<DeleteUserCommand>
{
    public async Task Handle(DeleteUserCommand input, CancellationToken ct)
    {
        await userRepository.DeleteUserAsync(input.UserRefId);
    }
}
