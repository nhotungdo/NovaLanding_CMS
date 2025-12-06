namespace NovaLanding.DTOs;

public class MenuRequest
{
    public string Name { get; set; } = null!;
    public string Location { get; set; } = null!;
    public bool IsActive { get; set; } = true;
}

public class MenuResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Location { get; set; } = null!;
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<MenuItemResponse>? Items { get; set; }
}

public class MenuItemRequest
{
    public long MenuId { get; set; }
    public long? ParentId { get; set; }
    public string Label { get; set; } = null!;
    public string? Url { get; set; }
    public int OrderNum { get; set; }
    public bool IsActive { get; set; } = true;
}

public class MenuItemResponse
{
    public long Id { get; set; }
    public long MenuId { get; set; }
    public long? ParentId { get; set; }
    public string Label { get; set; } = null!;
    public string? Url { get; set; }
    public int OrderNum { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public List<MenuItemResponse>? Children { get; set; }
}
