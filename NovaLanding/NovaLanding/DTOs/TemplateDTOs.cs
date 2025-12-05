using System.ComponentModel.DataAnnotations;

namespace NovaLanding.DTOs;

public class CreateBlockTemplateRequest
{
    [Required(ErrorMessage = "Name is required")]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Type is required")]
    [MaxLength(20)]
    public string Type { get; set; } = null!;

    public string? DefaultHtml { get; set; }
    public string? Description { get; set; }
    public string? PreviewImage { get; set; }
}

public class UpdateBlockTemplateRequest
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(20)]
    public string? Type { get; set; }

    public string? DefaultHtml { get; set; }
    public string? Description { get; set; }
    public string? PreviewImage { get; set; }
    public bool? IsActive { get; set; }
}

public class BlockTemplateResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string? DefaultHtml { get; set; }
    public string? Description { get; set; }
    public string? PreviewImage { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class BlockTemplateFilterRequest
{
    public string? Type { get; set; }
    public string? SearchKeyword { get; set; }
    public string? SortBy { get; set; } = "created_at";
    public bool Descending { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class BlockTemplateExportData
{
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string? DefaultHtml { get; set; }
    public string? Description { get; set; }
    public string? PreviewImage { get; set; }
}
