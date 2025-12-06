using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "admin")]
public class UserApiController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IActivityLogService _activityLogService;

    public UserApiController(IUserService userService, IActivityLogService activityLogService)
    {
        _userService = userService;
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetById(long id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create([FromBody] UserCreateRequest request)
    {
        try
        {
            var adminId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userService.CreateUserAsync(request);
            
            await _activityLogService.LogActivityAsync(adminId, "Create User", "User", user.Id, $"Created user: {user.Username}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponse>> Update(long id, [FromBody] UserUpdateRequest request)
    {
        try
        {
            var adminId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userService.UpdateUserAsync(id, request);
            
            await _activityLogService.LogActivityAsync(adminId, "Update User", "User", user.Id, $"Updated user: {user.Username}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return Ok(user);
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

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            var adminId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _userService.DeleteUserAsync(id);
            
            await _activityLogService.LogActivityAsync(adminId, "Delete User", "User", id, null, HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
