using System;
using System.Collections.Generic;

namespace NovaLanding.Models;

public partial class Page
{
    public long Id { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string Status { get; set; } = null!;

    public long UserId { get; set; }

    public DateTime? PublishedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<PageSection> PageSections { get; set; } = new List<PageSection>();

    public virtual ICollection<Lead> Leads { get; set; } = new List<Lead>();

    public virtual ICollection<PageView> PageViews { get; set; } = new List<PageView>();

    public virtual User User { get; set; } = null!;
}
