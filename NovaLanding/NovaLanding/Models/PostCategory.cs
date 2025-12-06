namespace NovaLanding.Models;

public partial class PostCategory
{
    public long PostId { get; set; }
    public long CategoryId { get; set; }
    
    public virtual Post Post { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
}
