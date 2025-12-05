namespace NovaLanding.DTOs;

public class MediaResponse
{
    public long Id { get; set; }
    public string Filename { get; set; } = null!;
    public string Path { get; set; } = null!;
    public string MimeType { get; set; } = null!;
    public long? Size { get; set; }
    public long UserId { get; set; }
    public DateTime? UploadedAt { get; set; }
    public string Url { get; set; } = null!;
}

public class MediaFilterRequest
{
    public string? SearchKeyword { get; set; }
    public string? MimeType { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class UploadResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public MediaResponse? Media { get; set; }
}
