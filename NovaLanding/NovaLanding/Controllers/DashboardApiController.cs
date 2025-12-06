using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardApiController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardApiController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsResponse>> GetStats()
    {
        var stats = await _dashboardService.GetDashboardStatsAsync();
        return Ok(stats);
    }
}
