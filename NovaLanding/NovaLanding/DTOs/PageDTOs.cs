using System.ComponentModel.DataAnnotations;

namespace NovaLanding.DTOs;

public class CreatePageRequest
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200)]
    public string Title { get; set; } = null!;
}

public class UpdatePageRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }
    
    public string? Status { get; set; }
}

public class PageResponse
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Status { get; set; } = null!;
    public long UserId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PageSectionResponse>? Sections { get; set; }
}

public class PageListResponse
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    public int SectionCount { get; set; }
}

public class PageFilterRequest
{
    public string? Status { get; set; }
    public string? SearchKeyword { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class AddSectionRequest
{
    [Required]
    public long BlockTemplateId { get; set; }
    
    public int? OrderNum { get; set; }
    
    public string? CustomContent { get; set; }
}

public class UpdateSectionRequest
{
    public int? OrderNum { get; set; }
    public bool? IsActive { get; set; }
    public string? CustomContent { get; set; }
}

public class PageSectionResponse
{
    public long Id { get; set; }
    public long PageId { get; set; }
    public long BlockTemplateId { get; set; }
    public string BlockTemplateName { get; set; } = null!;
    public string BlockTemplateType { get; set; } = null!;
    public int? OrderNum { get; set; }
    public bool? IsActive { get; set; }
    public string? CustomContent { get; set; }
    public string? DefaultHtml { get; set; }
}

public class ReorderSectionsRequest
{
    [Required]
    public List<SectionOrder> Sections { get; set; } = new();
}

public class SectionOrder
{
    public long SectionId { get; set; }
    public int OrderNum { get; set; }
}
