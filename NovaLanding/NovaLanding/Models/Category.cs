namespace NovaLanding.Models;

public partial class Category
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public virtual ICollection<PostCategory> PostCategories { get; set; } = new List<PostCategory>();
}
