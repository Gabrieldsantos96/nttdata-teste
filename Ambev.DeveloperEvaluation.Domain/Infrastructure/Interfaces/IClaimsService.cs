using System.Security.Claims;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
public interface IClaimsService
{
    int? GetUserId();
    Guid? GetUserRefId();
    public string? GetUsername();
    public string? GetRole();
    bool IsInRole(string role);
    public List<Claim>? GetAllClaims();
    Claim? GetClaimFirstOrDefault(Func<Claim, bool> predicate);
    Task<List<Claim>> GenerateClaimsAsync(Guid userRefId);
}
