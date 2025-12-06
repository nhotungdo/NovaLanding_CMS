namespace NovaLanding.Models;

public partial class MenuItem
{
    public long Id { get; set; }
    public long MenuId { get; set; }
    public long? ParentId { get; set; }
    public string Label { get; set; } = null!;
    public string? Url { get; set; }
    public int OrderNum { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    
    public virtual Menu Menu { get; set; } = null!;
    public virtual MenuItem? Parent { get; set; }
    public virtual ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();
}
