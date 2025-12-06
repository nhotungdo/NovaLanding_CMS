namespace NovaLanding.DTOs;

public class DashboardStatsResponse
{
    public int TotalPages { get; set; }
    public int PublishedPages { get; set; }
    public int DraftPages { get; set; }
    public int TotalPosts { get; set; }
    public int PublishedPosts { get; set; }
    public int TotalMedia { get; set; }
    public int TotalForms { get; set; }
    public int TotalSubmissions { get; set; }
    public int TotalLeads { get; set; }
    public int TotalUsers { get; set; }
    public int TotalPageViews { get; set; }
    public List<RecentActivityResponse>? RecentActivities { get; set; }
}

public class RecentActivityResponse
{
    public long Id { get; set; }
    public string Action { get; set; } = null!;
    public string? EntityType { get; set; }
    public long? EntityId { get; set; }
    public string? Details { get; set; }
    public string? Username { get; set; }
    public DateTime? CreatedAt { get; set; }
}
