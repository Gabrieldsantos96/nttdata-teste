using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Ambev.DeveloperEvaluation.Domain.Infrastructure.Interfaces.Adapters;

namespace Ambev.DeveloperEvaluation.Infra.Adapters;
public sealed class JwtService(IConfiguration _config) : IJwtService
{
    private string CreateToken(List<Claim> claims)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));

        var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_config.GetValue<int>("Jwt:ExpirationInMinutes")),
        signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
    );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }
    public (string, string) CreateJwt(List<Claim> claims)
    {
        return (CreateToken(claims), GenerateRefreshToken());
    }

    public ClaimsPrincipal ValidateJwt(string token)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var tokenHandler = new JwtSecurityTokenHandler();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _config["Jwt:Issuer"],
            ValidAudience = _config["Jwt:Audience"],
            IssuerSigningKey = securityKey,
            ClockSkew = TimeSpan.Zero
        };

        return tokenHandler.ValidateToken(token, validationParameters, out _);
    }
}