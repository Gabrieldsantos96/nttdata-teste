using Ambev.DeveloperEvaluation.Domain.Entities;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Queries;
public record GetUserQuery(Guid UserRefId) : IRequest<User>;

