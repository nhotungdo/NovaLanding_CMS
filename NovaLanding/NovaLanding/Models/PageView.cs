using System;

namespace NovaLanding.Models;

public partial class PageView
{
    public long Id { get; set; }
    public long PageId { get; set; }
    public DateTime? ViewedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public virtual Page Page { get; set; } = null!;
}
