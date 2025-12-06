namespace NovaLanding.Services;

public interface ITelegramService
{
    Task SendMessageAsync(long chatId, string message);
    Task NotifyLoginAsync(long userId, string email, string ipAddress);
    Task NotifyAdminLoginAsync(long userId, string email, string ipAddress);
    Task NotifyRegistrationAsync(long userId, string email);
    Task NotifyAdminRegistrationAsync(string email, string ipAddress);
    Task NotifyPagePublishedAsync(long userId, string pageTitle, string pageSlug);
    Task NotifyNewLeadAsync(long userId, string pageTitle, Dictionary<string, string> formData);
    Task NotifyFormSubmissionAsync(string formName, string dataJson);
    Task SendTestNotificationAsync();
}
