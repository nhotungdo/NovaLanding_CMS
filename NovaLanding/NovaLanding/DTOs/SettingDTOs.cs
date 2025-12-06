namespace NovaLanding.DTOs;

public class SettingRequest
{
    public string Key { get; set; } = null!;
    public string? Value { get; set; }
    public string? Description { get; set; }
}

public class SettingResponse
{
    public long Id { get; set; }
    public string Key { get; set; } = null!;
    public string? Value { get; set; }
    public string? Description { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class SettingsUpdateRequest
{
    public Dictionary<string, string> Settings { get; set; } = new();
}

public class TelegramTestRequest
{
    public string Message { get; set; } = "Test notification from NovaLanding CMS";
}
