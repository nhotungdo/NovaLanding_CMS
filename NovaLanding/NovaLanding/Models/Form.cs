namespace NovaLanding.Models;

public partial class Form
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string FieldsJson { get; set; } = null!; // JSON array of form fields
    public bool IsActive { get; set; } = true;
    public long UserId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
