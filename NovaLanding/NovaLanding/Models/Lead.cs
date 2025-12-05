using System;

namespace NovaLanding.Models;

public partial class Lead
{
    public long Id { get; set; }
    public long PageId { get; set; }
    public string FormData { get; set; } = null!;
    public DateTime? SubmittedAt { get; set; }
    public string? IpAddress { get; set; }
    public virtual Page Page { get; set; } = null!;
}
