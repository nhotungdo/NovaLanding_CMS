using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Middleware;

public class ActivityLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ActivityLoggingMiddleware> _logger;

    public ActivityLoggingMiddleware(RequestDelegate next, ILogger<ActivityLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IActivityLogService activityLogService)
    {
        // Log only specific actions (POST, PUT, DELETE)
        if (context.Request.Method != "GET" && context.Request.Path.StartsWithSegments("/api"))
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
            long? userId = userIdClaim != null ? long.Parse(userIdClaim.Value) : null;

            var action = $"{context.Request.Method} {context.Request.Path}";
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();

            try
            {
                await activityLogService.LogActivityAsync(userId, action, null, null, null, ipAddress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log activity");
            }
        }

        await _next(context);
    }
}
