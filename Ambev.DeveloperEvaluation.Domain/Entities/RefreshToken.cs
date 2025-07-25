namespace Ambev.DeveloperEvaluation.Domain.Entities;
public sealed class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserRefId { get; set; }
    public DateTime ExpiresOnUtc { get; set; } = DateTime.UtcNow.AddDays(3);
    public string TokenHash { get; set; } = string.Empty;
}
