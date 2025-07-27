using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Microsoft.AspNetCore.Identity;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public sealed class PasswordHelper : IPasswordHelper
{
    private readonly IPasswordHasher<User> _passwordHasher;
    public PasswordHelper(IPasswordHasher<User> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public string GeneratePassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(User user, string hashedPassword, string password)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, password);
        return result == PasswordVerificationResult.Success;
    }
}