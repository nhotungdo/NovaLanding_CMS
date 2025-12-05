using System;
using System.Collections.Generic;

namespace NovaLanding.Models;

public partial class Medium
{
    public long Id { get; set; }

    public string Filename { get; set; } = null!;

    public string Path { get; set; } = null!;

    public string MimeType { get; set; } = null!;

    public long? Size { get; set; }

    public long UserId { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
