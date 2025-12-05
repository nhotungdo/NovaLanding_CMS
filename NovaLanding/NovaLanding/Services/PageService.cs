using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class PageService : IPageService
{
    private readonly LandingCmsContext _context;
    private readonly ILogger<PageService> _logger;
    private readonly ITelegramService _telegramService;

    public PageService(
        LandingCmsContext context,
        ILogger<PageService> logger,
        ITelegramService telegramService)
    {
        _context = context;
        _logger = logger;
        _telegramService = telegramService;
    }

    public async Task<PageResponse> CreatePageAsync(long userId, CreatePageRequest request)
    {
        var slug = GenerateSlug(request.Title);
        
        // Ensure unique slug
        var existingSlug = await _context.Pages.AnyAsync(p => p.Slug == slug);
        if (existingSlug)
        {
            slug = $"{slug}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        }

        var page = new Page
        {
            Title = request.Title,
            Slug = slug,
            Status = "draft",
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Pages.Add(page);
        await _context.SaveChangesAsync();

        return MapToResponse(page);
    }

    public async Task<PageResponse> UpdatePageAsync(long pageId, long userId, UpdatePageRequest request)
    {
        var page = await _context.Pages.FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);
        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        if (page.Status == "published")
        {
            throw new InvalidOperationException("Cannot edit published page. Unpublish first.");
        }

        if (!string.IsNullOrEmpty(request.Title))
        {
            page.Title = request.Title;
            page.Slug = GenerateSlug(request.Title);
        }

        if (!string.IsNullOrEmpty(request.Status))
        {
            page.Status = request.Status;
        }

        page.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetPageAsync(pageId, userId);
    }

    public async Task DeletePageAsync(long pageId, long userId)
    {
        var page = await _context.Pages
            .Include(p => p.PageSections)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        if (page.PageSections.Any())
        {
            throw new InvalidOperationException("Cannot delete page with sections. Remove sections first.");
        }

        _context.Pages.Remove(page);
        await _context.SaveChangesAsync();
    }

    public async Task<PageResponse> GetPageAsync(long pageId, long userId)
    {
        var page = await _context.Pages
            .Include(p => p.PageSections.OrderBy(s => s.OrderNum))
            .ThenInclude(s => s.BlockTemplate)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        return MapToResponse(page, true);
    }

    public async Task<PageResponse> GetPageBySlugAsync(string slug)
    {
        var page = await _context.Pages
            .Include(p => p.PageSections.Where(s => s.IsActive == true).OrderBy(s => s.OrderNum))
            .ThenInclude(s => s.BlockTemplate)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == "published");

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        return MapToResponse(page, true);
    }

    public async Task<(List<PageListResponse> Items, int TotalCount)> GetPagesAsync(long userId, PageFilterRequest filter)
    {
        var query = _context.Pages.Where(p => p.UserId == userId);

        if (!string.IsNullOrEmpty(filter.Status))
        {
            query = query.Where(p => p.Status == filter.Status);
        }

        if (!string.IsNullOrEmpty(filter.SearchKeyword))
        {
            query = query.Where(p => p.Title.Contains(filter.SearchKeyword) || p.Slug.Contains(filter.SearchKeyword));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => new PageListResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                SectionCount = p.PageSections.Count
            })
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<PageResponse> ClonePageAsync(long pageId, long userId)
    {
        var originalPage = await _context.Pages
            .Include(p => p.PageSections)
            .ThenInclude(s => s.BlockTemplate)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (originalPage == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        var newPage = new Page
        {
            Title = $"{originalPage.Title} (Copy)",
            Slug = $"{originalPage.Slug}-copy-{Guid.NewGuid().ToString().Substring(0, 8)}",
            Status = "draft",
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Pages.Add(newPage);
        await _context.SaveChangesAsync();

        foreach (var section in originalPage.PageSections.OrderBy(s => s.OrderNum))
        {
            var newSection = new PageSection
            {
                PageId = newPage.Id,
                BlockTemplateId = section.BlockTemplateId,
                OrderNum = section.OrderNum,
                IsActive = section.IsActive,
                CustomContent = section.CustomContent,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.PageSections.Add(newSection);
        }

        await _context.SaveChangesAsync();

        return await GetPageAsync(newPage.Id, userId);
    }

    public async Task<PageResponse> PublishPageAsync(long pageId, long userId)
    {
        var page = await _context.Pages
            .Include(p => p.PageSections)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        if (!page.PageSections.Any())
        {
            throw new InvalidOperationException("Cannot publish page without sections");
        }

        page.Status = "published";
        page.PublishedAt = DateTime.UtcNow;
        page.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Send publish notification asynchronously
        _ = Task.Run(async () =>
        {
            try
            {
                await _telegramService.NotifyPagePublishedAsync(userId, page.Title, page.Slug);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send publish notification");
            }
        });

        return await GetPageAsync(pageId, userId);
    }

    public async Task<PageResponse> UnpublishPageAsync(long pageId, long userId)
    {
        var page = await _context.Pages.FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        page.Status = "draft";
        page.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetPageAsync(pageId, userId);
    }

    public async Task<PageSectionResponse> AddSectionAsync(long pageId, long userId, AddSectionRequest request)
    {
        var page = await _context.Pages.FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);
        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        if (page.Status == "published")
        {
            throw new InvalidOperationException("Cannot edit published page");
        }

        var template = await _context.BlocksTemplates.FindAsync(request.BlockTemplateId);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found");
        }

        var maxOrder = await _context.PageSections
            .Where(s => s.PageId == pageId)
            .MaxAsync(s => (int?)s.OrderNum) ?? -1;

        var section = new PageSection
        {
            PageId = pageId,
            BlockTemplateId = request.BlockTemplateId,
            OrderNum = request.OrderNum ?? (maxOrder + 1),
            IsActive = true,
            CustomContent = request.CustomContent,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.PageSections.Add(section);
        await _context.SaveChangesAsync();

        return MapToSectionResponse(section, template);
    }

    public async Task<PageSectionResponse> UpdateSectionAsync(long sectionId, long userId, UpdateSectionRequest request)
    {
        var section = await _context.PageSections
            .Include(s => s.Page)
            .Include(s => s.BlockTemplate)
            .FirstOrDefaultAsync(s => s.Id == sectionId && s.Page.UserId == userId);

        if (section == null)
        {
            throw new KeyNotFoundException("Section not found");
        }

        if (section.Page.Status == "published")
        {
            throw new InvalidOperationException("Cannot edit published page");
        }

        if (request.OrderNum.HasValue)
            section.OrderNum = request.OrderNum.Value;

        if (request.IsActive.HasValue)
            section.IsActive = request.IsActive.Value;

        if (request.CustomContent != null)
            section.CustomContent = request.CustomContent;

        section.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToSectionResponse(section, section.BlockTemplate);
    }

    public async Task DeleteSectionAsync(long sectionId, long userId)
    {
        var section = await _context.PageSections
            .Include(s => s.Page)
            .FirstOrDefaultAsync(s => s.Id == sectionId && s.Page.UserId == userId);

        if (section == null)
        {
            throw new KeyNotFoundException("Section not found");
        }

        if (section.Page.Status == "published")
        {
            throw new InvalidOperationException("Cannot edit published page");
        }

        _context.PageSections.Remove(section);
        await _context.SaveChangesAsync();
    }

    public async Task ReorderSectionsAsync(long pageId, long userId, ReorderSectionsRequest request)
    {
        var page = await _context.Pages
            .Include(p => p.PageSections)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        if (page.Status == "published")
        {
            throw new InvalidOperationException("Cannot edit published page");
        }

        foreach (var order in request.Sections)
        {
            var section = page.PageSections.FirstOrDefault(s => s.Id == order.SectionId);
            if (section != null)
            {
                section.OrderNum = order.OrderNum;
                section.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
    }

    private string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        slug = slug.Trim('-');
        return slug;
    }

    private PageResponse MapToResponse(Page page, bool includeSections = false)
    {
        var response = new PageResponse
        {
            Id = page.Id,
            Title = page.Title,
            Slug = page.Slug,
            Status = page.Status,
            UserId = page.UserId,
            PublishedAt = page.PublishedAt,
            CreatedAt = page.CreatedAt,
            UpdatedAt = page.UpdatedAt
        };

        if (includeSections && page.PageSections != null)
        {
            response.Sections = page.PageSections
                .Select(s => MapToSectionResponse(s, s.BlockTemplate))
                .ToList();
        }

        return response;
    }

    private PageSectionResponse MapToSectionResponse(PageSection section, BlocksTemplate template)
    {
        return new PageSectionResponse
        {
            Id = section.Id,
            PageId = section.PageId,
            BlockTemplateId = section.BlockTemplateId,
            BlockTemplateName = template.Name,
            BlockTemplateType = template.Type,
            OrderNum = section.OrderNum,
            IsActive = section.IsActive,
            CustomContent = section.CustomContent,
            DefaultHtml = template.DefaultHtml
        };
    }
}
