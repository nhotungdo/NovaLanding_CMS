namespace NovaLanding.Models;

public partial class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
}
