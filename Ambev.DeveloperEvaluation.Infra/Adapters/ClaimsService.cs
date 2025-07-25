using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;
using Ambev.DeveloperEvaluation.Domain.ValueObjects;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;

public class ClaimsService(IHttpContextAccessor? httpContextAccessor) : IClaimsService
{
    public int? GetUserId()
    {
        var userIdString = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

        return userIdString == null ? 0 : int.Parse(userIdString);
    }
    public string? GetUserEmail()
    {
        return httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimTypes.Email);
    }
    public Guid GetUserRefId()
    {
        var userIdString = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.UserRefId);

        return userIdString == null ? Guid.Empty : Guid.Parse(userIdString);
    }
    public Name GetUsernameValueObject()
    {
        var nameString = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Username);
        return Name.FromString(nameString!);
    }

    public string GetUsername()
    {
        var nameString = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Username);
        return Name.FromString(nameString!).ToString();
    }

    public string? GetStatus()
    {
        return httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Status);
    }

    public Address GetAddressValueObject()
    {
        var address = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Address);
        return Address.FromJsonString(address!);
    }

    public string? GetPhone()
    {
        return httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Phone);
    }
    public string? GetRole()
    {
        return httpContextAccessor?.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;
    }
    public bool IsInRole(string role)
    {
        return httpContextAccessor?.HttpContext?.User.IsInRole(role) ?? false;
    }

    public List<Claim>? GetAllClaims()
    {
        return httpContextAccessor?.HttpContext?.User.Claims.ToList();
    }
    public Claim? GetClaimFirstOrDefault(Func<Claim, bool> predicate)
    {
        return httpContextAccessor?.HttpContext?.User.Claims.FirstOrDefault(predicate);
    }

    public List<Claim> GenerateClaims(User user)
    {
        return
        [
            new Claim(ClaimsConsts.Username, user?.Name.ToSerializedString() ?? string.Empty),
            new Claim(ClaimsConsts.UserRefId, user?.RefId.ToString() ?? string.Empty),
            new Claim(ClaimsConsts.Address, user?.Address.ToJsonString() ?? string.Empty),
            new Claim(ClaimsConsts.Phone, user?.Phone.ToString() ?? string.Empty),
            new Claim(ClaimsConsts.Status, user?.Status.ToString() ?? string.Empty),
            new Claim(ClaimTypes.Role, user?.Role.ToString() ?? string.Empty),
        ];
    }
}
