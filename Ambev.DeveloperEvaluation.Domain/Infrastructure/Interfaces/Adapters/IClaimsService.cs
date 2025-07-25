using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;
using System.Security.Claims;

namespace Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
public interface IClaimsService
{
    int? GetUserId();
    Guid GetUserRefId();
    string? GetPhone();
    string? GetStatus();
    public Name GetUsernameValueObject();
    public string GetUsername();
    public Address GetAddressValueObject();
    public string? GetRole();
    bool IsInRole(string role);
    public List<Claim>? GetAllClaims();
    Claim? GetClaimFirstOrDefault(Func<Claim, bool> predicate);
   List<Claim> GenerateClaims(User user);
}
