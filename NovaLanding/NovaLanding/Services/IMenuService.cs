using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IMenuService
{
    Task<List<MenuResponse>> GetAllMenusAsync();
    Task<MenuResponse> GetMenuByIdAsync(long id);
    Task<MenuResponse> GetMenuByLocationAsync(string location);
    Task<MenuResponse> CreateMenuAsync(MenuRequest request);
    Task<MenuResponse> UpdateMenuAsync(long id, MenuRequest request);
    Task DeleteMenuAsync(long id);
    Task<MenuItemResponse> CreateMenuItemAsync(MenuItemRequest request);
    Task<MenuItemResponse> UpdateMenuItemAsync(long id, MenuItemRequest request);
    Task DeleteMenuItemAsync(long id);
    Task ReorderMenuItemsAsync(long menuId, List<long> itemIds);
}
