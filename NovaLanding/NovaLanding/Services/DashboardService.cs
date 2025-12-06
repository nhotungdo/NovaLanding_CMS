using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class DashboardService : IDashboardService
{
    private readonly LandingCmsContext _context;

    public DashboardService(LandingCmsContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsResponse> GetDashboardStatsAsync()
    {
        var totalPages = await _context.Pages.CountAsync();
        var publishedPages = await _context.Pages.CountAsync(p => p.Status == "published");
        var draftPages = await _context.Pages.CountAsync(p => p.Status == "draft");

        var totalPosts = await _context.Posts.CountAsync();
        var publishedPosts = await _context.Posts.CountAsync(p => p.Status == "published");

        var totalMedia = await _context.Media.CountAsync();
        var totalForms = await _context.Forms.CountAsync();
        var totalSubmissions = await _context.Submissions.CountAsync();
        var totalLeads = await _context.Leads.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalPageViews = await _context.PageViews.CountAsync();

        var recentActivities = await _context.ActivityLogs
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .Select(a => new RecentActivityResponse
            {
                Id = a.Id,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                Details = a.Details,
                Username = a.User != null ? a.User.Username : "System",
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return new DashboardStatsResponse
        {
            TotalPages = totalPages,
            PublishedPages = publishedPages,
            DraftPages = draftPages,
            TotalPosts = totalPosts,
            PublishedPosts = publishedPosts,
            TotalMedia = totalMedia,
            TotalForms = totalForms,
            TotalSubmissions = totalSubmissions,
            TotalLeads = totalLeads,
            TotalUsers = totalUsers,
            TotalPageViews = totalPageViews,
            RecentActivities = recentActivities
        };
    }
}
