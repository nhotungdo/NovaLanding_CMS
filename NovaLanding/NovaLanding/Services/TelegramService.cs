using Microsoft.EntityFrameworkCore;
using NovaLanding.Models;
using System.Text;
using System.Text.Json;

namespace NovaLanding.Services;

public class TelegramService : ITelegramService
{
    private readonly LandingCmsContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TelegramService> _logger;
    private readonly HttpClient _httpClient;
    private readonly string? _botToken;
    private readonly long? _adminChatId;

    public TelegramService(
        LandingCmsContext context,
        IConfiguration configuration,
        ILogger<TelegramService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _botToken = _configuration["Telegram:BotToken"];
        if (long.TryParse(_configuration["Telegram:AdminChatId"], out var adminId))
        {
            _adminChatId = adminId;
        }
    }

    public async Task SendMessageAsync(long chatId, string message)
    {
        if (string.IsNullOrEmpty(_botToken))
        {
            _logger.LogWarning("Telegram bot token not configured. Message not sent.");
            return;
        }

        try
        {
            var url = $"https://api.telegram.org/bot{_botToken}/sendMessage";
            var payload = new
            {
                chat_id = chatId,
                text = message,
                parse_mode = "HTML"
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Failed to send Telegram message: {error}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Telegram message");
        }
    }

    public async Task NotifyLoginAsync(long userId, string email, string ipAddress)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.TelegramChatId == null)
            {
                return;
            }

            var message = $"🔐 <b>Security Alert</b>\n\n" +
                         $"New login detected:\n" +
                         $"📧 Email: {email}\n" +
                         $"🌐 IP Address: {ipAddress}\n" +
                         $"🕐 Time: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC\n\n" +
                         $"If this wasn't you, please secure your account immediately.";

            await SendMessageAsync(user.TelegramChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending login notification");
        }
    }

    public async Task NotifyAdminLoginAsync(long userId, string email, string ipAddress)
    {
        try
        {
            if (_adminChatId == null)
            {
                return;
            }

            var message = $"🔔 <b>Login Event</b>\n\n" +
                         $"📧 Email: {email}\n" +
                         $"🆔 User ID: {userId}\n" +
                         $"🌐 IP Address: {ipAddress}\n" +
                         $"🕐 Time: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC";

            await SendMessageAsync(_adminChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending admin login notification");
        }
    }

    public async Task NotifyRegistrationAsync(long userId, string email)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.TelegramChatId == null)
            {
                return;
            }

            var message = $"🎉 <b>Welcome to NovaLanding!</b>\n\n" +
                         $"Your account has been successfully created.\n\n" +
                         $"📧 Email: {email}\n" +
                         $"🕐 Registered: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC\n\n" +
                         $"You can now start creating amazing landing pages!";

            await SendMessageAsync(user.TelegramChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending registration notification");
        }
    }

    public async Task NotifyAdminRegistrationAsync(string email, string ipAddress)
    {
        try
        {
            if (_adminChatId == null)
            {
                return;
            }

            var message = $"🆕 <b>New Registration</b>\n\n" +
                         $"📧 Email: {email}\n" +
                         $"🌐 IP Address: {ipAddress}\n" +
                         $"🕐 Time: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC";

            await SendMessageAsync(_adminChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending admin registration notification");
        }
    }

    public async Task NotifyPagePublishedAsync(long userId, string pageTitle, string pageSlug)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.TelegramChatId == null)
            {
                return;
            }

            var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "https://localhost:5001";
            var pageUrl = $"{baseUrl}/view/{pageSlug}";

            var message = $"✅ <b>Page Published Successfully!</b>\n\n" +
                         $"📄 Page: {pageTitle}\n" +
                         $"🔗 URL: {pageUrl}\n" +
                         $"🕐 Published: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC\n\n" +
                         $"Your landing page is now live!";

            await SendMessageAsync(user.TelegramChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending page published notification");
        }
    }

    public async Task NotifyNewLeadAsync(long userId, string pageTitle, Dictionary<string, string> formData)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.TelegramChatId == null)
            {
                return;
            }

            var formDataText = new StringBuilder();
            foreach (var field in formData)
            {
                formDataText.AppendLine($"• <b>{field.Key}:</b> {field.Value}");
            }

            var message = $"🎯 <b>New Lead Received!</b>\n\n" +
                         $"📄 Page: {pageTitle}\n" +
                         $"🕐 Time: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC\n\n" +
                         $"<b>Form Data:</b>\n{formDataText}\n" +
                         $"Follow up with this lead as soon as possible!";

            await SendMessageAsync(user.TelegramChatId.Value, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending new lead notification");
        }
    }
}
