using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PageController : ControllerBase
{
    private readonly IPageService _pageService;
    private readonly ILogger<PageController> _logger;

    public PageController(IPageService pageService, ILogger<PageController> logger)
    {
        _pageService = pageService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePage([FromBody] CreatePageRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.CreatePageAsync(userId, request);
            return CreatedAtAction(nameof(GetPage), new { id = response.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create page");
            return StatusCode(500, new { message = "Failed to create page" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePage(long id, [FromBody] UpdatePageRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.UpdatePageAsync(id, userId, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update page");
            return StatusCode(500, new { message = "Failed to update page" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePage(long id)
    {
        try
        {
            var userId = GetUserId();
            await _pageService.DeletePageAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete page");
            return StatusCode(500, new { message = "Failed to delete page" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPage(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.GetPageAsync(id, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get page");
            return StatusCode(500, new { message = "Failed to get page" });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetPages([FromQuery] PageFilterRequest filter)
    {
        try
        {
            var userId = GetUserId();
            var (items, totalCount) = await _pageService.GetPagesAsync(userId, filter);
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
            _logger.LogError(ex, "Failed to get pages");
            return StatusCode(500, new { message = "Failed to get pages" });
        }
    }

    [HttpPost("{id}/clone")]
    public async Task<IActionResult> ClonePage(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.ClonePageAsync(id, userId);
            return CreatedAtAction(nameof(GetPage), new { id = response.Id }, response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to clone page");
            return StatusCode(500, new { message = "Failed to clone page" });
        }
    }

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> PublishPage(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.PublishPageAsync(id, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish page");
            return StatusCode(500, new { message = "Failed to publish page" });
        }
    }

    [HttpPost("{id}/unpublish")]
    public async Task<IActionResult> UnpublishPage(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.UnpublishPageAsync(id, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to unpublish page");
            return StatusCode(500, new { message = "Failed to unpublish page" });
        }
    }

    [HttpPost("{id}/sections")]
    public async Task<IActionResult> AddSection(long id, [FromBody] AddSectionRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.AddSectionAsync(id, userId, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add section");
            return StatusCode(500, new { message = "Failed to add section" });
        }
    }

    [HttpPut("sections/{sectionId}")]
    public async Task<IActionResult> UpdateSection(long sectionId, [FromBody] UpdateSectionRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _pageService.UpdateSectionAsync(sectionId, userId, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update section");
            return StatusCode(500, new { message = "Failed to update section" });
        }
    }

    [HttpDelete("sections/{sectionId}")]
    public async Task<IActionResult> DeleteSection(long sectionId)
    {
        try
        {
            var userId = GetUserId();
            await _pageService.DeleteSectionAsync(sectionId, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete section");
            return StatusCode(500, new { message = "Failed to delete section" });
        }
    }

    [HttpPost("{id}/sections/reorder")]
    public async Task<IActionResult> ReorderSections(long id, [FromBody] ReorderSectionsRequest request)
    {
        try
        {
            var userId = GetUserId();
            await _pageService.ReorderSectionsAsync(id, userId, request);
            return Ok(new { message = "Sections reordered successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reorder sections");
            return StatusCode(500, new { message = "Failed to reorder sections" });
        }
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}
