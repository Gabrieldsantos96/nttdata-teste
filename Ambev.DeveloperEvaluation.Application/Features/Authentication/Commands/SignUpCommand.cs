using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using Ambev.DeveloperEvaluation.Shared.Models;
using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.Commands;
public record SignUpDto
{
    public string Email { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public Name Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string Zipcode { get; set; } = null!;
    public string Number { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Geo { get; set; } = null!;
    public string Password { get; set; } = null!;
}
public record SignUpCommand : IRequest<MutationResult<object>>
{
    public SignUpDto Command { get; set; } = null!;
}
