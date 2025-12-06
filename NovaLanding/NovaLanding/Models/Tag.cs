namespace NovaLanding.Models;

public partial class Tag
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    
    public virtual ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
}
