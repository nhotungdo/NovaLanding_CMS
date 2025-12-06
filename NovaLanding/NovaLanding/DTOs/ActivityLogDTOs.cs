namespace NovaLanding.DTOs;

public class ActivityLogResponse
{
    public long Id { get; set; }
    public long? UserId { get; set; }
    public string? Username { get; set; }
    public string Action { get; set; } = null!;
    public string? EntityType { get; set; }
    public long? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpAddress { get; set; }
    public DateTime? CreatedAt { get; set; }
}
