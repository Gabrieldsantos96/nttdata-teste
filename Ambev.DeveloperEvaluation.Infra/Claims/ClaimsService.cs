using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Ambev.DeveloperEvaluation.Shared.Consts;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.Infra.Claims;

public class ClaimsService(IDatabaseContextFactory contextFactory, IHttpContextAccessor? httpContextAccessor) : IClaimsService
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
    public Guid? GetUserRefId()
    {
        var userIdString = httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.UserRefId);

        return userIdString == null ? Guid.Empty : Guid.Parse(userIdString);
    }
    public string? GetUsername()
    {
        return httpContextAccessor?.HttpContext?.User.FindFirstValue(ClaimsConsts.Username);
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

    public async Task<List<Claim>> GenerateClaimsAsync(Guid userRefId)
    {
        await using var context = await contextFactory.CreateDbContextAsync();

        var user = await context.Users
            .AsNoTracking()
            .IgnoreQueryFilters()
            .Where(x => x.RefId == userRefId)
            .Select(c => new
            {
                c.Name, c.RefId
            })
            .FirstOrDefaultAsync();

        return
        [
            new Claim(ClaimsConsts.Username, user?.Name.ToString() ?? string.Empty),
            new Claim(ClaimsConsts.UserRefId, userRefId.ToString()),
        ];
    }
}
