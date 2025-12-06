using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize(Roles = "admin")]
public class SettingsApiController : ControllerBase
{
    private readonly ISettingsService _settingsService;
    private readonly IActivityLogService _activityLogService;

    public SettingsApiController(ISettingsService settingsService, IActivityLogService activityLogService)
    {
        _settingsService = settingsService;
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SettingResponse>>> GetAll()
    {
        var settings = await _settingsService.GetAllSettingsAsync();
        return Ok(settings);
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<SettingResponse>> GetByKey(string key)
    {
        var setting = await _settingsService.GetSettingByKeyAsync(key);
        if (setting == null)
            return NotFound();

        return Ok(setting);
    }

    [HttpPost]
    public async Task<ActionResult<SettingResponse>> Upsert([FromBody] SettingRequest request)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var setting = await _settingsService.UpsertSettingAsync(request);
        
        await _activityLogService.LogActivityAsync(userId, "Update Setting", "Setting", setting.Id, $"Updated setting: {setting.Key}", HttpContext.Connection.RemoteIpAddress?.ToString());
        
        return Ok(setting);
    }

    [HttpPost("update-multiple")]
    public async Task<ActionResult> UpdateMultiple([FromBody] SettingsUpdateRequest request)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _settingsService.UpdateMultipleSettingsAsync(request.Settings);
        
        await _activityLogService.LogActivityAsync(userId, "Update Multiple Settings", "Setting", null, $"Updated {request.Settings.Count} settings", HttpContext.Connection.RemoteIpAddress?.ToString());
        
        return Ok(new { message = "Settings updated successfully" });
    }

    [HttpDelete("{key}")]
    public async Task<ActionResult> Delete(string key)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _settingsService.DeleteSettingAsync(key);
            
            await _activityLogService.LogActivityAsync(userId, "Delete Setting", "Setting", null, $"Deleted setting: {key}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("test-telegram")]
    public async Task<ActionResult> TestTelegram()
    {
        var success = await _settingsService.TestTelegramAsync();
        
        if (success)
            return Ok(new { message = "Telegram notification sent successfully" });
        else
            return BadRequest(new { message = "Failed to send Telegram notification" });
    }
}
