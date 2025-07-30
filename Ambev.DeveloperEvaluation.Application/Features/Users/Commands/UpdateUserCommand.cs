using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Users.Commands;

public sealed class UpdateUserDto
{
    public string Email { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public Name Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string Zipcode { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Geolocation { get; set; } = null!;
    public string Number { get; set; } = null!;
}

public sealed class UpdateUserCommand : IRequest<MutationResult<User>>
{
    public Guid RefId { get; set; }
    public string Email { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public Name Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string Zipcode { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Geolocation { get; set; } = null!;
    public string Number { get; set; } = null!;
}
