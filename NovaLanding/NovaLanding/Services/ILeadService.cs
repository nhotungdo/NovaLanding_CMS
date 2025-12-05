using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface ILeadService
{
    Task<LeadResponse> SubmitLeadAsync(string pageSlug, SubmitLeadRequest request, string ipAddress);
    Task<(List<LeadResponse> Items, int TotalCount)> GetLeadsAsync(long userId, LeadFilterRequest filter);
    Task<LeadResponse> GetLeadAsync(long leadId, long userId);
    Task DeleteLeadAsync(long leadId, long userId);
    Task<PageAnalyticsResponse> GetPageAnalyticsAsync(long pageId, long userId);
}
