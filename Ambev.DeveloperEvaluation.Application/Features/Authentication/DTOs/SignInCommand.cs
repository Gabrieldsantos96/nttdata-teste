namespace Ambev.DeveloperEvaluation.Application.Features.Authentication.DTOs;
public sealed class SignInCommand
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}
