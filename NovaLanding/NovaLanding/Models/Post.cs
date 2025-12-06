namespace NovaLanding.Models;

public partial class Post
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public long? ThumbnailId { get; set; }
    public string Status { get; set; } = "draft";
    public long UserId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
    public virtual Medium? Thumbnail { get; set; }
    public virtual ICollection<PostCategory> PostCategories { get; set; } = new List<PostCategory>();
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
}
