using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly LandingCmsContext _context;

    public ActivityLogService(LandingCmsContext context)
    {
        _context = context;
    }

    public async Task LogActivityAsync(long? userId, string action, string? entityType = null, long? entityId = null, string? details = null, string? ipAddress = null)
    {
        var log = new ActivityLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details,
            IpAddress = ipAddress,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ActivityLogResponse>> GetAllLogsAsync(int page = 1, int pageSize = 50)
    {
        var logs = await _context.ActivityLogs
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return logs.Select(MapToResponse).ToList();
    }

    public async Task<List<ActivityLogResponse>> GetUserLogsAsync(long userId, int page = 1, int pageSize = 50)
    {
        var logs = await _context.ActivityLogs
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return logs.Select(MapToResponse).ToList();
    }

    public async Task DeleteLogAsync(long id)
    {
        var log = await _context.ActivityLogs.FindAsync(id);
        if (log == null)
            throw new KeyNotFoundException("Log not found");

        _context.ActivityLogs.Remove(log);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteOldLogsAsync(int daysToKeep = 90)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysToKeep);
        var oldLogs = await _context.ActivityLogs
            .Where(a => a.CreatedAt < cutoffDate)
            .ToListAsync();

        _context.ActivityLogs.RemoveRange(oldLogs);
        await _context.SaveChangesAsync();
    }

    private ActivityLogResponse MapToResponse(ActivityLog log)
    {
        return new ActivityLogResponse
        {
            Id = log.Id,
            UserId = log.UserId,
            Username = log.User?.Username,
            Action = log.Action,
            EntityType = log.EntityType,
            EntityId = log.EntityId,
            Details = log.Details,
            IpAddress = log.IpAddress,
            CreatedAt = log.CreatedAt
        };
    }
}
