using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface ISettingsService
{
    Task<List<SettingResponse>> GetAllSettingsAsync();
    Task<SettingResponse?> GetSettingByKeyAsync(string key);
    Task<SettingResponse> UpsertSettingAsync(SettingRequest request);
    Task UpdateMultipleSettingsAsync(Dictionary<string, string> settings);
    Task DeleteSettingAsync(string key);
    Task<bool> TestTelegramAsync();
}
