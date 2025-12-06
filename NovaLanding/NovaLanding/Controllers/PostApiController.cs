using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/posts")]
public class PostApiController : ControllerBase
{
    private readonly IPostService _postService;
    private readonly IActivityLogService _activityLogService;

    public PostApiController(IPostService postService, IActivityLogService activityLogService)
    {
        _postService = postService;
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PostResponse>>> GetAll()
    {
        var posts = await _postService.GetAllPostsAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostResponse>> GetById(long id)
    {
        try
        {
            var post = await _postService.GetPostByIdAsync(id);
            return Ok(post);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<PostResponse>> GetBySlug(string slug)
    {
        try
        {
            var post = await _postService.GetPostBySlugAsync(slug);
            return Ok(post);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostResponse>> Create([FromBody] PostRequest request)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var post = await _postService.CreatePostAsync(userId, request);
            
            await _activityLogService.LogActivityAsync(userId, "Create Post", "Post", post.Id, $"Created post: {post.Title}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<PostResponse>> Update(long id, [FromBody] PostRequest request)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var post = await _postService.UpdatePostAsync(id, request);
            
            await _activityLogService.LogActivityAsync(userId, "Update Post", "Post", post.Id, $"Updated post: {post.Title}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return Ok(post);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _postService.DeletePostAsync(id);
            
            await _activityLogService.LogActivityAsync(userId, "Delete Post", "Post", id, null, HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryResponse>>> GetCategories()
    {
        var categories = await _postService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [Authorize]
    [HttpPost("categories")]
    public async Task<ActionResult<CategoryResponse>> CreateCategory([FromBody] CategoryRequest request)
    {
        try
        {
            var category = await _postService.CreateCategoryAsync(request);
            return CreatedAtAction(nameof(GetCategories), category);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("tags")]
    public async Task<ActionResult<List<TagResponse>>> GetTags()
    {
        var tags = await _postService.GetAllTagsAsync();
        return Ok(tags);
    }

    [Authorize]
    [HttpPost("tags")]
    public async Task<ActionResult<TagResponse>> CreateTag([FromBody] TagRequest request)
    {
        try
        {
            var tag = await _postService.CreateTagAsync(request);
            return CreatedAtAction(nameof(GetTags), tag);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
