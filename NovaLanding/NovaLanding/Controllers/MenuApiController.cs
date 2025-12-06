using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/menus")]
public class MenuApiController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly IActivityLogService _activityLogService;

    public MenuApiController(IMenuService menuService, IActivityLogService activityLogService)
    {
        _menuService = menuService;
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<ActionResult<List<MenuResponse>>> GetAll()
    {
        var menus = await _menuService.GetAllMenusAsync();
        return Ok(menus);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MenuResponse>> GetById(long id)
    {
        try
        {
            var menu = await _menuService.GetMenuByIdAsync(id);
            return Ok(menu);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("location/{location}")]
    public async Task<ActionResult<MenuResponse>> GetByLocation(string location)
    {
        try
        {
            var menu = await _menuService.GetMenuByLocationAsync(location);
            return Ok(menu);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<MenuResponse>> Create([FromBody] MenuRequest request)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var menu = await _menuService.CreateMenuAsync(request);
        
        await _activityLogService.LogActivityAsync(userId, "Create Menu", "Menu", menu.Id, $"Created menu: {menu.Name}", HttpContext.Connection.RemoteIpAddress?.ToString());
        
        return CreatedAtAction(nameof(GetById), new { id = menu.Id }, menu);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<MenuResponse>> Update(long id, [FromBody] MenuRequest request)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var menu = await _menuService.UpdateMenuAsync(id, request);
            
            await _activityLogService.LogActivityAsync(userId, "Update Menu", "Menu", menu.Id, $"Updated menu: {menu.Name}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return Ok(menu);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _menuService.DeleteMenuAsync(id);
            
            await _activityLogService.LogActivityAsync(userId, "Delete Menu", "Menu", id, null, HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpPost("items")]
    public async Task<ActionResult<MenuItemResponse>> CreateItem([FromBody] MenuItemRequest request)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var item = await _menuService.CreateMenuItemAsync(request);
        
        await _activityLogService.LogActivityAsync(userId, "Create Menu Item", "MenuItem", item.Id, $"Created menu item: {item.Label}", HttpContext.Connection.RemoteIpAddress?.ToString());
        
        return Ok(item);
    }

    [Authorize]
    [HttpPut("items/{id}")]
    public async Task<ActionResult<MenuItemResponse>> UpdateItem(long id, [FromBody] MenuItemRequest request)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var item = await _menuService.UpdateMenuItemAsync(id, request);
            
            await _activityLogService.LogActivityAsync(userId, "Update Menu Item", "MenuItem", item.Id, $"Updated menu item: {item.Label}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return Ok(item);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpDelete("items/{id}")]
    public async Task<ActionResult> DeleteItem(long id)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _menuService.DeleteMenuItemAsync(id);
            
            await _activityLogService.LogActivityAsync(userId, "Delete Menu Item", "MenuItem", id, null, HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
