using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;
    private readonly ILogger<MediaController> _logger;

    public MediaController(IMediaService mediaService, ILogger<MediaController> logger)
    {
        _mediaService = mediaService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        try
        {
            var userId = GetUserId();
            var response = await _mediaService.UploadFileAsync(userId, file);
            return Ok(new UploadResult
            {
                Success = true,
                Message = "File uploaded successfully",
                Media = response
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new UploadResult
            {
                Success = false,
                Message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file");
            return StatusCode(500, new UploadResult
            {
                Success = false,
                Message = "Failed to upload file"
            });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMedia([FromQuery] MediaFilterRequest filter)
    {
        try
        {
            var userId = GetUserId();
            var (items, totalCount) = await _mediaService.GetMediaAsync(userId, filter);
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
            _logger.LogError(ex, "Failed to get media");
            return StatusCode(500, new { message = "Failed to get media" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMediaById(long id)
    {
        try
        {
            var userId = GetUserId();
            var response = await _mediaService.GetMediaByIdAsync(id, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get media");
            return StatusCode(500, new { message = "Failed to get media" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedia(long id)
    {
        try
        {
            var userId = GetUserId();
            await _mediaService.DeleteMediaAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete media");
            return StatusCode(500, new { message = "Failed to delete media" });
        }
    }

    private long GetUserId()
    {
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}
