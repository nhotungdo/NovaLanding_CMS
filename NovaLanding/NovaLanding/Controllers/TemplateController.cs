using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Middleware;
using NovaLanding.Services;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TemplateController : ControllerBase
{
    private readonly ITemplateService _templateService;
    private readonly ILogger<TemplateController> _logger;

    public TemplateController(ITemplateService templateService, ILogger<TemplateController> logger)
    {
        _templateService = templateService;
        _logger = logger;
    }

    [HttpPost]
    [RoleAuthorization("admin")]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateBlockTemplateRequest request)
    {
        try
        {
            var response = await _templateService.CreateBlockTemplateAsync(request);
            return CreatedAtAction(nameof(GetTemplate), new { id = response.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create template");
            return StatusCode(500, new { message = "Failed to create template" });
        }
    }

    [HttpPut("{id}")]
    [RoleAuthorization("admin")]
    public async Task<IActionResult> UpdateTemplate(long id, [FromBody] UpdateBlockTemplateRequest request)
    {
        try
        {
            var response = await _templateService.UpdateBlockTemplateAsync(id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update template");
            return StatusCode(500, new { message = "Failed to update template" });
        }
    }

    [HttpDelete("{id}")]
    [RoleAuthorization("admin")]
    public async Task<IActionResult> DeleteTemplate(long id)
    {
        try
        {
            await _templateService.DeleteBlockTemplateAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete template");
            return StatusCode(500, new { message = "Failed to delete template" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemplate(long id)
    {
        try
        {
            var response = await _templateService.GetBlockTemplateAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get template");
            return StatusCode(500, new { message = "Failed to get template" });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetTemplates([FromQuery] BlockTemplateFilterRequest filter)
    {
        try
        {
            var (items, totalCount) = await _templateService.GetBlockTemplatesAsync(filter);
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
            _logger.LogError(ex, "Failed to get templates");
            return StatusCode(500, new { message = "Failed to get templates" });
        }
    }

    [HttpGet("{id}/export")]
    [RoleAuthorization("admin")]
    public async Task<IActionResult> ExportTemplate(long id)
    {
        try
        {
            var json = await _templateService.ExportBlockTemplateAsync(id);
            return Content(json, "application/json");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to export template");
            return StatusCode(500, new { message = "Failed to export template" });
        }
    }

    [HttpPost("import")]
    [RoleAuthorization("admin")]
    public async Task<IActionResult> ImportTemplate([FromBody] string jsonData)
    {
        try
        {
            var response = await _templateService.ImportBlockTemplateAsync(jsonData);
            return CreatedAtAction(nameof(GetTemplate), new { id = response.Id }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to import template");
            return StatusCode(500, new { message = "Failed to import template" });
        }
    }
}
