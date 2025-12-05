using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class TemplateService : ITemplateService
{
    private readonly LandingCmsContext _context;
    private readonly ILogger<TemplateService> _logger;

    public TemplateService(LandingCmsContext context, ILogger<TemplateService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<BlockTemplateResponse> CreateBlockTemplateAsync(CreateBlockTemplateRequest request)
    {
        var template = new BlocksTemplate
        {
            Name = request.Name,
            Type = request.Type,
            DefaultHtml = request.DefaultHtml,
            Description = request.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.BlocksTemplates.Add(template);
        await _context.SaveChangesAsync();

        return MapToResponse(template);
    }

    public async Task<BlockTemplateResponse> UpdateBlockTemplateAsync(long id, UpdateBlockTemplateRequest request)
    {
        var template = await _context.BlocksTemplates.FindAsync(id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found");
        }

        if (!string.IsNullOrEmpty(request.Name))
            template.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Type))
            template.Type = request.Type;

        if (request.DefaultHtml != null)
            template.DefaultHtml = request.DefaultHtml;

        if (request.Description != null)
            template.Description = request.Description;

        if (request.IsActive.HasValue)
            template.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();

        return MapToResponse(template);
    }

    public async Task DeleteBlockTemplateAsync(long id)
    {
        var template = await _context.BlocksTemplates.FindAsync(id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found");
        }

        _context.BlocksTemplates.Remove(template);
        await _context.SaveChangesAsync();
    }

    public async Task<BlockTemplateResponse> GetBlockTemplateAsync(long id)
    {
        var template = await _context.BlocksTemplates.FindAsync(id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found");
        }

        return MapToResponse(template);
    }

    public async Task<(List<BlockTemplateResponse> Items, int TotalCount)> GetBlockTemplatesAsync(BlockTemplateFilterRequest filter)
    {
        var query = _context.BlocksTemplates.AsQueryable();

        // Filter by type
        if (!string.IsNullOrEmpty(filter.Type))
        {
            query = query.Where(t => t.Type == filter.Type);
        }

        // Search by keyword
        if (!string.IsNullOrEmpty(filter.SearchKeyword))
        {
            query = query.Where(t => t.Name.Contains(filter.SearchKeyword) || 
                                    (t.Description != null && t.Description.Contains(filter.SearchKeyword)));
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Sort
        query = filter.SortBy?.ToLower() switch
        {
            "name" => filter.Descending ? query.OrderByDescending(t => t.Name) : query.OrderBy(t => t.Name),
            "type" => filter.Descending ? query.OrderByDescending(t => t.Type) : query.OrderBy(t => t.Type),
            _ => filter.Descending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt)
        };

        // Pagination
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(t => MapToResponse(t))
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<string> ExportBlockTemplateAsync(long id)
    {
        var template = await _context.BlocksTemplates.FindAsync(id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found");
        }

        var exportData = new BlockTemplateExportData
        {
            Name = template.Name,
            Type = template.Type,
            DefaultHtml = template.DefaultHtml,
            Description = template.Description
        };

        return JsonSerializer.Serialize(exportData, new JsonSerializerOptions { WriteIndented = true });
    }

    public async Task<BlockTemplateResponse> ImportBlockTemplateAsync(string jsonData)
    {
        try
        {
            var importData = JsonSerializer.Deserialize<BlockTemplateExportData>(jsonData);
            if (importData == null)
            {
                throw new InvalidOperationException("Invalid JSON data");
            }

            var request = new CreateBlockTemplateRequest
            {
                Name = importData.Name,
                Type = importData.Type,
                DefaultHtml = importData.DefaultHtml,
                Description = importData.Description
            };

            return await CreateBlockTemplateAsync(request);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse JSON");
            throw new InvalidOperationException("Invalid JSON format");
        }
    }

    private static BlockTemplateResponse MapToResponse(BlocksTemplate template)
    {
        return new BlockTemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Type = template.Type,
            DefaultHtml = template.DefaultHtml,
            Description = template.Description,
            IsActive = template.IsActive,
            CreatedAt = template.CreatedAt
        };
    }
}
