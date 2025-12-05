using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NovaLanding.Services;
using System.Text;

namespace NovaLanding.Controllers;

[ApiController]
[Route("view")]
public class PublicController : ControllerBase
{
    private readonly IPageService _pageService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<PublicController> _logger;

    public PublicController(IPageService pageService, IMemoryCache cache, ILogger<PublicController> logger)
    {
        _pageService = pageService;
        _cache = cache;
        _logger = logger;
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> ViewPage(string slug)
    {
        try
        {
            var cacheKey = $"page_{slug}";
            
            if (!_cache.TryGetValue(cacheKey, out string? html))
            {
                var page = await _pageService.GetPageBySlugAsync(slug);
                html = RenderPage(page);
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
                
                _cache.Set(cacheKey, html, cacheOptions);
            }

            // Track page view asynchronously
            _ = Task.Run(async () =>
            {
                try
                {
                    await TrackPageView(slug);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to track page view");
                }
            });

            return Content(html!, "text/html");
        }
        catch (KeyNotFoundException)
        {
            return NotFound("<html><body><h1>404 - Page Not Found</h1></body></html>");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to render page");
            return StatusCode(500, "<html><body><h1>500 - Internal Server Error</h1></body></html>");
        }
    }

    private async Task TrackPageView(string slug)
    {
        var page = await _pageService.GetPageBySlugAsync(slug);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        // This would need to be implemented in PageService or a separate tracking service
        // For now, we'll leave it as a placeholder
    }

    private string RenderPage(DTOs.PageResponse page)
    {
        var sb = new StringBuilder();
        
        sb.AppendLine("<!DOCTYPE html>");
        sb.AppendLine("<html lang=\"en\">");
        sb.AppendLine("<head>");
        sb.AppendLine($"    <meta charset=\"UTF-8\">");
        sb.AppendLine($"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        sb.AppendLine($"    <title>{EscapeHtml(page.Title)}</title>");
        sb.AppendLine($"    <meta name=\"description\" content=\"{EscapeHtml(page.Title)}\">");
        sb.AppendLine("    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\">");
        sb.AppendLine("</head>");
        sb.AppendLine("<body>");
        
        if (page.Sections != null)
        {
            foreach (var section in page.Sections.OrderBy(s => s.OrderNum))
            {
                if (section.IsActive == true)
                {
                    var html = MergeContent(section.DefaultHtml, section.CustomContent);
                    sb.AppendLine(html);
                }
            }
        }
        
        sb.AppendLine("    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>");
        sb.AppendLine("</body>");
        sb.AppendLine("</html>");
        
        return sb.ToString();
    }

    private string MergeContent(string? defaultHtml, string? customContent)
    {
        if (string.IsNullOrEmpty(customContent))
        {
            return defaultHtml ?? "";
        }

        // If custom content is JSON, you could parse and merge with template
        // For now, return custom content if available, otherwise default
        return customContent;
    }

    private string EscapeHtml(string text)
    {
        return System.Net.WebUtility.HtmlEncode(text);
    }
}
