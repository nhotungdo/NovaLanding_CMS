using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaLanding.DTOs;
using NovaLanding.Services;
using System.Security.Claims;

namespace NovaLanding.Controllers;

[ApiController]
[Route("api/forms")]
public class FormApiController : ControllerBase
{
    private readonly IFormService _formService;
    private readonly IActivityLogService _activityLogService;

    public FormApiController(IFormService formService, IActivityLogService activityLogService)
    {
        _formService = formService;
        _activityLogService = activityLogService;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FormResponse>>> GetAll()
    {
        var forms = await _formService.GetAllFormsAsync();
        return Ok(forms);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormResponse>> GetById(long id)
    {
        try
        {
            var form = await _formService.GetFormByIdAsync(id);
            return Ok(form);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<FormResponse>> Create([FromBody] FormRequest request)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var form = await _formService.CreateFormAsync(userId, request);
        
        await _activityLogService.LogActivityAsync(userId, "Create Form", "Form", form.Id, $"Created form: {form.Name}", HttpContext.Connection.RemoteIpAddress?.ToString());
        
        return CreatedAtAction(nameof(GetById), new { id = form.Id }, form);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<FormResponse>> Update(long id, [FromBody] FormRequest request)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var form = await _formService.UpdateFormAsync(id, request);
            
            await _activityLogService.LogActivityAsync(userId, "Update Form", "Form", form.Id, $"Updated form: {form.Name}", HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return Ok(form);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _formService.DeleteFormAsync(id);
            
            await _activityLogService.LogActivityAsync(userId, "Delete Form", "Form", id, null, HttpContext.Connection.RemoteIpAddress?.ToString());
            
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("submit")]
    public async Task<ActionResult<SubmissionResponse>> Submit([FromBody] SubmissionRequest request)
    {
        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
            
            var submission = await _formService.SubmitFormAsync(request, ipAddress, userAgent);
            
            return Ok(submission);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("{formId}/submissions")]
    public async Task<ActionResult<List<SubmissionResponse>>> GetSubmissions(long formId)
    {
        var submissions = await _formService.GetFormSubmissionsAsync(formId);
        return Ok(submissions);
    }

    [Authorize]
    [HttpGet("{formId}/export")]
    public async Task<ActionResult> ExportSubmissions(long formId)
    {
        var csv = await _formService.ExportSubmissionsAsCsvAsync(formId);
        return File(csv, "text/csv", $"form_{formId}_submissions.csv");
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("submissions/{id}")]
    public async Task<ActionResult> DeleteSubmission(long id)
    {
        try
        {
            await _formService.DeleteSubmissionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
