using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class MenuService : IMenuService
{
    private readonly LandingCmsContext _context;

    public MenuService(LandingCmsContext context)
    {
        _context = context;
    }

    public async Task<List<MenuResponse>> GetAllMenusAsync()
    {
        var menus = await _context.Menus
            .Include(m => m.MenuItems.Where(mi => mi.ParentId == null))
            .ThenInclude(mi => mi.Children)
            .OrderBy(m => m.Name)
            .ToListAsync();

        return menus.Select(MapToResponse).ToList();
    }

    public async Task<MenuResponse> GetMenuByIdAsync(long id)
    {
        var menu = await _context.Menus
            .Include(m => m.MenuItems.Where(mi => mi.ParentId == null))
            .ThenInclude(mi => mi.Children)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null)
            throw new KeyNotFoundException("Menu not found");

        return MapToResponse(menu);
    }

    public async Task<MenuResponse> GetMenuByLocationAsync(string location)
    {
        var menu = await _context.Menus
            .Include(m => m.MenuItems.Where(mi => mi.ParentId == null && mi.IsActive))
            .ThenInclude(mi => mi.Children.Where(c => c.IsActive))
            .FirstOrDefaultAsync(m => m.Location == location && m.IsActive);

        if (menu == null)
            throw new KeyNotFoundException("Menu not found");

        return MapToResponse(menu);
    }

    public async Task<MenuResponse> CreateMenuAsync(MenuRequest request)
    {
        var menu = new Menu
        {
            Name = request.Name,
            Location = request.Location,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();

        return await GetMenuByIdAsync(menu.Id);
    }

    public async Task<MenuResponse> UpdateMenuAsync(long id, MenuRequest request)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null)
            throw new KeyNotFoundException("Menu not found");

        menu.Name = request.Name;
        menu.Location = request.Location;
        menu.IsActive = request.IsActive;
        menu.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetMenuByIdAsync(menu.Id);
    }

    public async Task DeleteMenuAsync(long id)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null)
            throw new KeyNotFoundException("Menu not found");

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync();
    }

    public async Task<MenuItemResponse> CreateMenuItemAsync(MenuItemRequest request)
    {
        var menuItem = new MenuItem
        {
            MenuId = request.MenuId,
            ParentId = request.ParentId,
            Label = request.Label,
            Url = request.Url,
            OrderNum = request.OrderNum,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync();

        return MapItemToResponse(menuItem);
    }

    public async Task<MenuItemResponse> UpdateMenuItemAsync(long id, MenuItemRequest request)
    {
        var menuItem = await _context.MenuItems.FindAsync(id);
        if (menuItem == null)
            throw new KeyNotFoundException("Menu item not found");

        menuItem.Label = request.Label;
        menuItem.Url = request.Url;
        menuItem.ParentId = request.ParentId;
        menuItem.OrderNum = request.OrderNum;
        menuItem.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return MapItemToResponse(menuItem);
    }

    public async Task DeleteMenuItemAsync(long id)
    {
        var menuItem = await _context.MenuItems.FindAsync(id);
        if (menuItem == null)
            throw new KeyNotFoundException("Menu item not found");

        _context.MenuItems.Remove(menuItem);
        await _context.SaveChangesAsync();
    }

    public async Task ReorderMenuItemsAsync(long menuId, List<long> itemIds)
    {
        for (int i = 0; i < itemIds.Count; i++)
        {
            var item = await _context.MenuItems.FindAsync(itemIds[i]);
            if (item != null && item.MenuId == menuId)
            {
                item.OrderNum = i;
            }
        }

        await _context.SaveChangesAsync();
    }

    private MenuResponse MapToResponse(Menu menu)
    {
        return new MenuResponse
        {
            Id = menu.Id,
            Name = menu.Name,
            Location = menu.Location,
            IsActive = menu.IsActive,
            CreatedAt = menu.CreatedAt,
            UpdatedAt = menu.UpdatedAt,
            Items = menu.MenuItems?
                .Where(mi => mi.ParentId == null)
                .OrderBy(mi => mi.OrderNum)
                .Select(MapItemToResponse)
                .ToList()
        };
    }

    private MenuItemResponse MapItemToResponse(MenuItem item)
    {
        return new MenuItemResponse
        {
            Id = item.Id,
            MenuId = item.MenuId,
            ParentId = item.ParentId,
            Label = item.Label,
            Url = item.Url,
            OrderNum = item.OrderNum,
            IsActive = item.IsActive,
            CreatedAt = item.CreatedAt,
            Children = item.Children?
                .OrderBy(c => c.OrderNum)
                .Select(MapItemToResponse)
                .ToList()
        };
    }
}
