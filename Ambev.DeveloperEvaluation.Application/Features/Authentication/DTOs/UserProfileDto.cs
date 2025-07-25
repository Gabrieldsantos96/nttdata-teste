using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
public sealed class UserProfileDto
{
    public Guid RefId { get; set; }
    public string Role { get; set; } = null!;
    public Name Name { get; set; } = null!;
    public Address Address { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
}
