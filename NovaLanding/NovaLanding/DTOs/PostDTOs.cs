namespace NovaLanding.DTOs;

public class PostRequest
{
    public string Title { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public long? ThumbnailId { get; set; }
    public string Status { get; set; } = "draft";
    public List<long>? CategoryIds { get; set; }
    public List<long>? TagIds { get; set; }
}

public class PostResponse
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public long? ThumbnailId { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string Status { get; set; } = null!;
    public long UserId { get; set; }
    public string? Username { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<CategoryResponse>? Categories { get; set; }
    public List<TagResponse>? Tags { get; set; }
}

public class CategoryRequest
{
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Description { get; set; }
}

public class CategoryResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class TagRequest
{
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
}

public class TagResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}
