namespace NovaLanding.Models;

public partial class PostTag
{
    public long PostId { get; set; }
    public long TagId { get; set; }
    
    public virtual Post Post { get; set; } = null!;
    public virtual Tag Tag { get; set; } = null!;
}
