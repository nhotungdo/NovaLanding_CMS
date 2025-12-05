using System;
using System.Collections.Generic;

namespace NovaLanding.Models;

public partial class BlocksTemplate
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string? DefaultHtml { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<PageSection> PageSections { get; set; } = new List<PageSection>();
}
