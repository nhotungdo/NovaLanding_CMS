using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/logs")]
[Authorize(Roles = "admin")]
public class ActivityLogApiController : ControllerBase
{
    private readonly IActivityLogService _activityLogService;

    public ActivityLogApiController(IActivityLogService activityLogService)
    {
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ActivityLogResponse>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var logs = await _activityLogService.GetAllLogsAsync(page, pageSize);
        return Ok(logs);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<ActivityLogResponse>>> GetUserLogs(long userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var logs = await _activityLogService.GetUserLogsAsync(userId, page, pageSize);
        return Ok(logs);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            await _activityLogService.DeleteLogAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("cleanup")]
    public async Task<ActionResult> Cleanup([FromQuery] int daysToKeep = 90)
    {
        await _activityLogService.DeleteOldLogsAsync(daysToKeep);
        return Ok(new { message = $"Deleted logs older than {daysToKeep} days" });
    }
}
