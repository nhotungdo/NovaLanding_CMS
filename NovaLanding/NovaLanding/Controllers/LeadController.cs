using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadController : ControllerBase
{
    private readonly ILeadService _leadService;
    private readonly ILogger<LeadController> _logger;

    public LeadController(ILeadService leadService, ILogger<LeadController> logger)
    {
        _leadService = leadService;
        _logger = logger;
    }

    [HttpPost("submit/{pageSlug}")]
    [AllowAnonymous]
    public async Task<IActionResult> SubmitLead(string pageSlug, [FromBody] SubmitLeadRequest request)
    {
        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var response = await _leadService.SubmitLeadAsync(pageSlug, request, ipAddress);
            return Ok(new { success = true, message = "Thank you! We'll contact you soon.", lead = response });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to submit lead");
            return StatusCode(500, new { success = false, message = "Failed to submit form" });
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetLeads([FromQuery] LeadFilterRequest filter)
    {
        try
        {
            var userId = GetUserId();
            var (items, totalCount) = await _leadService.GetLeadsAsync(userId, filter);
            return Ok(new
            {
                items,
                totalCount,
                page = filter.Page,
                pageSize = filter.PageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get leads");
            return StatusCode(500, new { message = "Failed to get leads" });
        }
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetLead(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _leadService.GetLeadAsync(id, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get lead");
            return StatusCode(500, new { message = "Failed to get lead" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteLead(long id)
    {
        try
        {
            var userId = GetUserId();
            await _leadService.DeleteLeadAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete lead");
            return StatusCode(500, new { message = "Failed to delete lead" });
        }
    }

    [HttpGet("analytics/{pageId}")]
    [Authorize]
    public async Task<IActionResult> GetPageAnalytics(long pageId)
    {
        try
        {
            var userId = GetUserId();
            var response = await _leadService.GetPageAnalyticsAsync(pageId, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get analytics");
            return StatusCode(500, new { message = "Failed to get analytics" });
        }
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}
