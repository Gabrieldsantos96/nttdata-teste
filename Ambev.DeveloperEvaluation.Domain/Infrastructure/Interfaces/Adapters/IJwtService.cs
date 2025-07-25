using System.Security.Claims;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
public interface IJwtService
{
    (string, string) CreateJwt(List<Claim> claims);
    ClaimsPrincipal ValidateJwt(string token);
}
