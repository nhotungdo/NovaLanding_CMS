using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class PostService : IPostService
{
    private readonly LandingCmsContext _context;

    public PostService(LandingCmsContext context)
    {
        _context = context;
    }

    public async Task<List<PostResponse>> GetAllPostsAsync()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Thumbnail)
            .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(MapToResponse).ToList();
    }

    public async Task<PostResponse> GetPostByIdAsync(long id)
    {
        var post = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Thumbnail)
            .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
            throw new KeyNotFoundException("Post not found");

        return MapToResponse(post);
    }

    public async Task<PostResponse> GetPostBySlugAsync(string slug)
    {
        var post = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Thumbnail)
            .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (post == null)
            throw new KeyNotFoundException("Post not found");

        return MapToResponse(post);
    }

    public async Task<PostResponse> CreatePostAsync(long userId, PostRequest request)
    {
        var slug = request.Slug ?? GenerateSlug(request.Title);

        if (await _context.Posts.AnyAsync(p => p.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        var post = new Post
        {
            Title = request.Title,
            Slug = slug,
            Content = request.Content,
            Excerpt = request.Excerpt,
            ThumbnailId = request.ThumbnailId,
            Status = request.Status,
            UserId = userId,
            PublishedAt = request.Status == "published" ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        // Add categories
        if (request.CategoryIds != null && request.CategoryIds.Any())
        {
            foreach (var catId in request.CategoryIds)
            {
                _context.PostCategories.Add(new PostCategory { PostId = post.Id, CategoryId = catId });
            }
        }

        // Add tags
        if (request.TagIds != null && request.TagIds.Any())
        {
            foreach (var tagId in request.TagIds)
            {
                _context.PostTags.Add(new PostTag { PostId = post.Id, TagId = tagId });
            }
        }

        await _context.SaveChangesAsync();

        return await GetPostByIdAsync(post.Id);
    }

    public async Task<PostResponse> UpdatePostAsync(long id, PostRequest request)
    {
        var post = await _context.Posts
            .Include(p => p.PostCategories)
            .Include(p => p.PostTags)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
            throw new KeyNotFoundException("Post not found");

        var slug = request.Slug ?? GenerateSlug(request.Title);
        if (slug != post.Slug && await _context.Posts.AnyAsync(p => p.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        post.Title = request.Title;
        post.Slug = slug;
        post.Content = request.Content;
        post.Excerpt = request.Excerpt;
        post.ThumbnailId = request.ThumbnailId;
        post.Status = request.Status;
        post.PublishedAt = request.Status == "published" && post.PublishedAt == null ? DateTime.UtcNow : post.PublishedAt;
        post.UpdatedAt = DateTime.UtcNow;

        // Update categories
        _context.PostCategories.RemoveRange(post.PostCategories);
        if (request.CategoryIds != null && request.CategoryIds.Any())
        {
            foreach (var catId in request.CategoryIds)
            {
                _context.PostCategories.Add(new PostCategory { PostId = post.Id, CategoryId = catId });
            }
        }

        // Update tags
        _context.PostTags.RemoveRange(post.PostTags);
        if (request.TagIds != null && request.TagIds.Any())
        {
            foreach (var tagId in request.TagIds)
            {
                _context.PostTags.Add(new PostTag { PostId = post.Id, TagId = tagId });
            }
        }

        await _context.SaveChangesAsync();

        return await GetPostByIdAsync(post.Id);
    }

    public async Task DeletePostAsync(long id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            throw new KeyNotFoundException("Post not found");

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CategoryResponse>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories.OrderBy(c => c.Name).ToListAsync();
        return categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request)
    {
        var slug = request.Slug ?? GenerateSlug(request.Name);

        if (await _context.Categories.AnyAsync(c => c.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        var category = new Category
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };
    }

    public async Task<CategoryResponse> UpdateCategoryAsync(long id, CategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            throw new KeyNotFoundException("Category not found");

        var slug = request.Slug ?? GenerateSlug(request.Name);
        if (slug != category.Slug && await _context.Categories.AnyAsync(c => c.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        category.Name = request.Name;
        category.Slug = slug;
        category.Description = request.Description;

        await _context.SaveChangesAsync();

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };
    }

    public async Task DeleteCategoryAsync(long id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            throw new KeyNotFoundException("Category not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }

    public async Task<List<TagResponse>> GetAllTagsAsync()
    {
        var tags = await _context.Tags.OrderBy(t => t.Name).ToListAsync();
        return tags.Select(t => new TagResponse
        {
            Id = t.Id,
            Name = t.Name,
            Slug = t.Slug,
            CreatedAt = t.CreatedAt
        }).ToList();
    }

    public async Task<TagResponse> CreateTagAsync(TagRequest request)
    {
        var slug = request.Slug ?? GenerateSlug(request.Name);

        if (await _context.Tags.AnyAsync(t => t.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        var tag = new Tag
        {
            Name = request.Name,
            Slug = slug,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tags.Add(tag);
        await _context.SaveChangesAsync();

        return new TagResponse
        {
            Id = tag.Id,
            Name = tag.Name,
            Slug = tag.Slug,
            CreatedAt = tag.CreatedAt
        };
    }

    public async Task<TagResponse> UpdateTagAsync(long id, TagRequest request)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null)
            throw new KeyNotFoundException("Tag not found");

        var slug = request.Slug ?? GenerateSlug(request.Name);
        if (slug != tag.Slug && await _context.Tags.AnyAsync(t => t.Slug == slug))
            throw new InvalidOperationException("Slug already exists");

        tag.Name = request.Name;
        tag.Slug = slug;

        await _context.SaveChangesAsync();

        return new TagResponse
        {
            Id = tag.Id,
            Name = tag.Name,
            Slug = tag.Slug,
            CreatedAt = tag.CreatedAt
        };
    }

    public async Task DeleteTagAsync(long id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null)
            throw new KeyNotFoundException("Tag not found");

        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
    }

    private PostResponse MapToResponse(Post post)
    {
        return new PostResponse
        {
            Id = post.Id,
            Title = post.Title,
            Slug = post.Slug,
            Content = post.Content,
            Excerpt = post.Excerpt,
            ThumbnailId = post.ThumbnailId,
            ThumbnailUrl = post.Thumbnail?.Path,
            Status = post.Status,
            UserId = post.UserId,
            Username = post.User?.Username,
            PublishedAt = post.PublishedAt,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Categories = post.PostCategories?.Select(pc => new CategoryResponse
            {
                Id = pc.Category.Id,
                Name = pc.Category.Name,
                Slug = pc.Category.Slug,
                Description = pc.Category.Description,
                CreatedAt = pc.Category.CreatedAt
            }).ToList(),
            Tags = post.PostTags?.Select(pt => new TagResponse
            {
                Id = pt.Tag.Id,
                Name = pt.Tag.Name,
                Slug = pt.Tag.Slug,
                CreatedAt = pt.Tag.CreatedAt
            }).ToList()
        };
    }

    private string GenerateSlug(string text)
    {
        return text.ToLower()
            .Replace(" ", "-")
            .Replace("&", "and")
            .Replace("?", "")
            .Replace("!", "")
            .Replace(",", "")
            .Replace(".", "");
    }
}
