using System.ComponentModel.DataAnnotations;

namespace NovaLanding.DTOs;

public class SubmitLeadRequest
{
    [Required]
    public Dictionary<string, string> FormData { get; set; } = new();
}

public class LeadResponse
{
    public long Id { get; set; }
    public long PageId { get; set; }
    public string PageTitle { get; set; } = null!;
    public string PageSlug { get; set; } = null!;
    public Dictionary<string, string> FormData { get; set; } = new();
    public DateTime? SubmittedAt { get; set; }
    public string? IpAddress { get; set; }
}

public class LeadFilterRequest
{
    public long? PageId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class PageAnalyticsResponse
{
    public long PageId { get; set; }
    public string PageTitle { get; set; } = null!;
    public string PageSlug { get; set; } = null!;
    public int TotalViews { get; set; }
    public int TotalLeads { get; set; }
    public double ConversionRate { get; set; }
    public List<ViewsByDate> ViewsByDate { get; set; } = new();
    public List<LeadsByDate> LeadsByDate { get; set; } = new();
}

public class ViewsByDate
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}

public class LeadsByDate
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}
