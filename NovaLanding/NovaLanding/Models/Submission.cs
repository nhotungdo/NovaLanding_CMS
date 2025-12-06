namespace NovaLanding.Models;

public partial class Submission
{
    public long Id { get; set; }
    public long FormId { get; set; }
    public string DataJson { get; set; } = null!;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime? SubmittedAt { get; set; }
    
    public virtual Form Form { get; set; } = null!;
}
