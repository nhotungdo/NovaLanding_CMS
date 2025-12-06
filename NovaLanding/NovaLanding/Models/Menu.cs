namespace NovaLanding.Models;

public partial class Menu
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Location { get; set; } = null!; // header, footer
    public bool IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}
