using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Repositories;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Queries;

public sealed class GetPaginatedUsersQueryHandler(IUserRepository userRepository) : IRequestHandler<GetPaginatedUserQuery, PaginatedResponse<User>>
{
    public Task<PaginatedResponse<User>> Handle(GetPaginatedUserQuery input, CancellationToken ct)
    {
        return userRepository.GetPaginatedUsersAsync(input.Skip, input.Take, input.Filter);
    }
}

