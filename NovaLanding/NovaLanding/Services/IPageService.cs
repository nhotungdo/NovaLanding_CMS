using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IPageService
{
    Task<PageResponse> CreatePageAsync(long userId, CreatePageRequest request);
    Task<PageResponse> UpdatePageAsync(long pageId, long userId, UpdatePageRequest request);
    Task DeletePageAsync(long pageId, long userId);
    Task<PageResponse> GetPageAsync(long pageId, long userId);
    Task<PageResponse> GetPageBySlugAsync(string slug);
    Task<(List<PageListResponse> Items, int TotalCount)> GetPagesAsync(long userId, PageFilterRequest filter);
    Task<PageResponse> ClonePageAsync(long pageId, long userId);
    Task<PageResponse> PublishPageAsync(long pageId, long userId);
    Task<PageResponse> UnpublishPageAsync(long pageId, long userId);
    
    Task<PageSectionResponse> AddSectionAsync(long pageId, long userId, AddSectionRequest request);
    Task<PageSectionResponse> UpdateSectionAsync(long sectionId, long userId, UpdateSectionRequest request);
    Task DeleteSectionAsync(long sectionId, long userId);
    Task ReorderSectionsAsync(long pageId, long userId, ReorderSectionsRequest request);
}
