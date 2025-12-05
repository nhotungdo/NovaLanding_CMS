using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class LeadService : ILeadService
{
    private readonly LandingCmsContext _context;
    private readonly ITelegramService _telegramService;
    private readonly ILogger<LeadService> _logger;

    public LeadService(
        LandingCmsContext context,
        ITelegramService telegramService,
        ILogger<LeadService> logger)
    {
        _context = context;
        _telegramService = telegramService;
        _logger = logger;
    }

    public async Task<LeadResponse> SubmitLeadAsync(string pageSlug, SubmitLeadRequest request, string ipAddress)
    {
        var page = await _context.Pages
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Slug == pageSlug && p.Status == "published");

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        var lead = new Lead
        {
            PageId = page.Id,
            FormData = JsonSerializer.Serialize(request.FormData),
            SubmittedAt = DateTime.UtcNow,
            IpAddress = ipAddress
        };

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();

        // Send Telegram notification to page owner
        _ = Task.Run(async () =>
        {
            try
            {
                await _telegramService.NotifyNewLeadAsync(
                    page.UserId,
                    page.Title,
                    request.FormData
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send lead notification");
            }
        });

        return MapToResponse(lead, page);
    }

    public async Task<(List<LeadResponse> Items, int TotalCount)> GetLeadsAsync(long userId, LeadFilterRequest filter)
    {
        var query = _context.Leads
            .Include(l => l.Page)
            .Where(l => l.Page.UserId == userId);

        if (filter.PageId.HasValue)
        {
            query = query.Where(l => l.PageId == filter.PageId.Value);
        }

        if (filter.FromDate.HasValue)
        {
            query = query.Where(l => l.SubmittedAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            query = query.Where(l => l.SubmittedAt <= filter.ToDate.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(l => l.SubmittedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(l => MapToResponse(l, l.Page))
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<LeadResponse> GetLeadAsync(long leadId, long userId)
    {
        var lead = await _context.Leads
            .Include(l => l.Page)
            .FirstOrDefaultAsync(l => l.Id == leadId && l.Page.UserId == userId);

        if (lead == null)
        {
            throw new KeyNotFoundException("Lead not found");
        }

        return MapToResponse(lead, lead.Page);
    }

    public async Task DeleteLeadAsync(long leadId, long userId)
    {
        var lead = await _context.Leads
            .Include(l => l.Page)
            .FirstOrDefaultAsync(l => l.Id == leadId && l.Page.UserId == userId);

        if (lead == null)
        {
            throw new KeyNotFoundException("Lead not found");
        }

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();
    }

    public async Task<PageAnalyticsResponse> GetPageAnalyticsAsync(long pageId, long userId)
    {
        var page = await _context.Pages
            .Include(p => p.PageViews)
            .Include(p => p.Leads)
            .FirstOrDefaultAsync(p => p.Id == pageId && p.UserId == userId);

        if (page == null)
        {
            throw new KeyNotFoundException("Page not found");
        }

        var totalViews = page.PageViews.Count;
        var totalLeads = page.Leads.Count;
        var conversionRate = totalViews > 0 ? (double)totalLeads / totalViews * 100 : 0;

        var viewsByDate = page.PageViews
            .GroupBy(v => v.ViewedAt!.Value.Date)
            .Select(g => new ViewsByDate
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(v => v.Date)
            .ToList();

        var leadsByDate = page.Leads
            .GroupBy(l => l.SubmittedAt!.Value.Date)
            .Select(g => new LeadsByDate
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(l => l.Date)
            .ToList();

        return new PageAnalyticsResponse
        {
            PageId = pageId,
            PageTitle = page.Title,
            PageSlug = page.Slug,
            TotalViews = totalViews,
            TotalLeads = totalLeads,
            ConversionRate = Math.Round(conversionRate, 2),
            ViewsByDate = viewsByDate,
            LeadsByDate = leadsByDate
        };
    }

    private LeadResponse MapToResponse(Lead lead, Page page)
    {
        Dictionary<string, string>? formData = null;
        try
        {
            formData = JsonSerializer.Deserialize<Dictionary<string, string>>(lead.FormData);
        }
        catch
        {
            formData = new Dictionary<string, string>();
        }

        return new LeadResponse
        {
            Id = lead.Id,
            PageId = lead.PageId,
            PageTitle = page.Title,
            PageSlug = page.Slug,
            FormData = formData ?? new Dictionary<string, string>(),
            SubmittedAt = lead.SubmittedAt,
            IpAddress = lead.IpAddress
        };
    }
}
