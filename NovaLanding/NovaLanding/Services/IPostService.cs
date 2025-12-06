using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IPostService
{
    Task<List<PostResponse>> GetAllPostsAsync();
    Task<PostResponse> GetPostByIdAsync(long id);
    Task<PostResponse> GetPostBySlugAsync(string slug);
    Task<PostResponse> CreatePostAsync(long userId, PostRequest request);
    Task<PostResponse> UpdatePostAsync(long id, PostRequest request);
    Task DeletePostAsync(long id);
    Task<List<CategoryResponse>> GetAllCategoriesAsync();
    Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request);
    Task<CategoryResponse> UpdateCategoryAsync(long id, CategoryRequest request);
    Task DeleteCategoryAsync(long id);
    Task<List<TagResponse>> GetAllTagsAsync();
    Task<TagResponse> CreateTagAsync(TagRequest request);
    Task<TagResponse> UpdateTagAsync(long id, TagRequest request);
    Task DeleteTagAsync(long id);
}
