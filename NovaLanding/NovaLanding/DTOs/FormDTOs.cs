namespace NovaLanding.DTOs;

public class FormRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string FieldsJson { get; set; } = null!;
    public bool IsActive { get; set; } = true;
}

public class FormResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string FieldsJson { get; set; } = null!;
    public bool IsActive { get; set; }
    public long UserId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int SubmissionCount { get; set; }
}

public class SubmissionRequest
{
    public long FormId { get; set; }
    public string DataJson { get; set; } = null!;
}

public class SubmissionResponse
{
    public long Id { get; set; }
    public long FormId { get; set; }
    public string FormName { get; set; } = null!;
    public string DataJson { get; set; } = null!;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime? SubmittedAt { get; set; }
}
