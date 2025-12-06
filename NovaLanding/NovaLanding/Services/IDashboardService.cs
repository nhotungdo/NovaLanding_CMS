using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetDashboardStatsAsync();
}
