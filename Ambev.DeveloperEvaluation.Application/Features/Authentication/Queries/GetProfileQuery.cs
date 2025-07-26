using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Queries;
public sealed class GetProfileQuery : IRequest<UserProfileResult>;
public record UserProfileResult
{
    public Guid RefId { get; set; }
    public string Role { get; set; } = null!;
    public Name Name { get; set; } = null!;
    public Address Address { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
}