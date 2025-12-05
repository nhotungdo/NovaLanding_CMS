using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IMediaService
{
    Task<MediaResponse> UploadFileAsync(long userId, IFormFile file);
    Task<(List<MediaResponse> Items, int TotalCount)> GetMediaAsync(long userId, MediaFilterRequest filter);
    Task<MediaResponse> GetMediaByIdAsync(long mediaId, long userId);
    Task DeleteMediaAsync(long mediaId, long userId);
}
