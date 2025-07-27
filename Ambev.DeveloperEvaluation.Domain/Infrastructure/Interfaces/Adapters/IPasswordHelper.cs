using Ambev.DeveloperEvaluation.Domain.Entities;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
public interface IPasswordHelper
{
    string GeneratePassword(User user, string password);
    bool VerifyPassword(User user, string hashedPassword, string password);
}