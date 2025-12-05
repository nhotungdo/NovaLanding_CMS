using System;
using System.Collections.Generic;

namespace NovaLanding.Models;

public partial class PageSection
{
    public long Id { get; set; }

    public long PageId { get; set; }

    public long BlockTemplateId { get; set; }

    public int? OrderNum { get; set; }

    public bool? IsActive { get; set; }

    public string? CustomContent { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual BlocksTemplate BlockTemplate { get; set; } = null!;

    public virtual Page Page { get; set; } = null!;
}
