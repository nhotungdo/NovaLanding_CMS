namespace NovaLanding.Models;

public partial class Setting
{
    public long Id { get; set; }
    public string Key { get; set; } = null!;
    public string? Value { get; set; }
    public string? Description { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
