using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class MediaService : IMediaService
{
    private readonly LandingCmsContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<MediaService> _logger;
    private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private readonly string[] _allowedVideoExtensions = { ".mp4", ".webm" };
    private const long MaxImageSize = 10 * 1024 * 1024; // 10MB
    private const long MaxVideoSize = 50 * 1024 * 1024; // 50MB

    public MediaService(LandingCmsContext context, IWebHostEnvironment environment, ILogger<MediaService> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    public async Task<MediaResponse> UploadFileAsync(long userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new InvalidOperationException("No file provided");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var isImage = _allowedImageExtensions.Contains(extension);
        var isVideo = _allowedVideoExtensions.Contains(extension);

        if (!isImage && !isVideo)
        {
            throw new InvalidOperationException($"File type {extension} is not allowed. Allowed: jpg, png, gif, webp, mp4, webm");
        }

        if (isImage && file.Length > MaxImageSize)
        {
            throw new InvalidOperationException($"Image size exceeds maximum of {MaxImageSize / 1024 / 1024}MB");
        }

        if (isVideo && file.Length > MaxVideoSize)
        {
            throw new InvalidOperationException($"Video size exceeds maximum of {MaxVideoSize / 1024 / 1024}MB");
        }

        // Create directory structure: uploads/YYYY/MM/DD
        var now = DateTime.UtcNow;
        var relativePath = Path.Combine("uploads", now.Year.ToString(), now.Month.ToString("D2"), now.Day.ToString("D2"));
        var absolutePath = Path.Combine(_environment.WebRootPath, relativePath);

        Directory.CreateDirectory(absolutePath);

        // Generate unique filename
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(absolutePath, uniqueFileName);
        var relativeFilePath = Path.Combine(relativePath, uniqueFileName).Replace("\\", "/");

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Save to database
        var media = new Medium
        {
            Filename = file.FileName,
            Path = relativeFilePath,
            MimeType = file.ContentType,
            Size = file.Length,
            UserId = userId,
            UploadedAt = DateTime.UtcNow
        };

        _context.Media.Add(media);
        await _context.SaveChangesAsync();

        return MapToResponse(media);
    }

    public async Task<(List<MediaResponse> Items, int TotalCount)> GetMediaAsync(long userId, MediaFilterRequest filter)
    {
        var query = _context.Media.Where(m => m.UserId == userId);

        if (!string.IsNullOrEmpty(filter.SearchKeyword))
        {
            query = query.Where(m => m.Filename.Contains(filter.SearchKeyword));
        }

        if (!string.IsNullOrEmpty(filter.MimeType))
        {
            query = query.Where(m => m.MimeType.StartsWith(filter.MimeType));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(m => m.UploadedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(m => MapToResponse(m))
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<MediaResponse> GetMediaByIdAsync(long mediaId, long userId)
    {
        var media = await _context.Media.FirstOrDefaultAsync(m => m.Id == mediaId && m.UserId == userId);
        if (media == null)
        {
            throw new KeyNotFoundException("Media not found");
        }

        return MapToResponse(media);
    }

    public async Task DeleteMediaAsync(long mediaId, long userId)
    {
        var media = await _context.Media.FirstOrDefaultAsync(m => m.Id == mediaId && m.UserId == userId);
        if (media == null)
        {
            throw new KeyNotFoundException("Media not found");
        }

        // Delete physical file
        var filePath = Path.Combine(_environment.WebRootPath, media.Path);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        _context.Media.Remove(media);
        await _context.SaveChangesAsync();
    }

    private MediaResponse MapToResponse(Medium media)
    {
        return new MediaResponse
        {
            Id = media.Id,
            Filename = media.Filename,
            Path = media.Path,
            MimeType = media.MimeType,
            Size = media.Size,
            UserId = media.UserId,
            UploadedAt = media.UploadedAt,
            Url = $"/{media.Path}"
        };
    }
}
