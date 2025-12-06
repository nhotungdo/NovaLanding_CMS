using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IActivityLogService
{
    Task LogActivityAsync(long? userId, string action, string? entityType = null, long? entityId = null, string? details = null, string? ipAddress = null);
    Task<List<ActivityLogResponse>> GetAllLogsAsync(int page = 1, int pageSize = 50);
    Task<List<ActivityLogResponse>> GetUserLogsAsync(long userId, int page = 1, int pageSize = 50);
    Task DeleteLogAsync(long id);
    Task DeleteOldLogsAsync(int daysToKeep = 90);
}
