using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class SettingsService : ISettingsService
{
    private readonly LandingCmsContext _context;
    private readonly ITelegramService _telegramService;

    public SettingsService(LandingCmsContext context, ITelegramService telegramService)
    {
        _context = context;
        _telegramService = telegramService;
    }

    public async Task<List<SettingResponse>> GetAllSettingsAsync()
    {
        var settings = await _context.Settings.OrderBy(s => s.Key).ToListAsync();
        return settings.Select(s => new SettingResponse
        {
            Id = s.Id,
            Key = s.Key,
            Value = s.Value,
            Description = s.Description,
            UpdatedAt = s.UpdatedAt
        }).ToList();
    }

    public async Task<SettingResponse?> GetSettingByKeyAsync(string key)
    {
        var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
            return null;

        return new SettingResponse
        {
            Id = setting.Id,
            Key = setting.Key,
            Value = setting.Value,
            Description = setting.Description,
            UpdatedAt = setting.UpdatedAt
        };
    }

    public async Task<SettingResponse> UpsertSettingAsync(SettingRequest request)
    {
        var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == request.Key);

        if (setting == null)
        {
            setting = new Setting
            {
                Key = request.Key,
                Value = request.Value,
                Description = request.Description,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Settings.Add(setting);
        }
        else
        {
            setting.Value = request.Value;
            setting.Description = request.Description;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new SettingResponse
        {
            Id = setting.Id,
            Key = setting.Key,
            Value = setting.Value,
            Description = setting.Description,
            UpdatedAt = setting.UpdatedAt
        };
    }

    public async Task UpdateMultipleSettingsAsync(Dictionary<string, string> settings)
    {
        foreach (var kvp in settings)
        {
            var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == kvp.Key);

            if (setting == null)
            {
                setting = new Setting
                {
                    Key = kvp.Key,
                    Value = kvp.Value,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Settings.Add(setting);
            }
            else
            {
                setting.Value = kvp.Value;
                setting.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteSettingAsync(string key)
    {
        var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
            throw new KeyNotFoundException("Setting not found");

        _context.Settings.Remove(setting);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> TestTelegramAsync()
    {
        try
        {
            await _telegramService.SendTestNotificationAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
