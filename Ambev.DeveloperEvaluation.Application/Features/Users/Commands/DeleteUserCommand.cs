using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Commands;
public sealed class DeleteUserCommand : IRequest
{
    public Guid UserRefId { get; set;  }
}
