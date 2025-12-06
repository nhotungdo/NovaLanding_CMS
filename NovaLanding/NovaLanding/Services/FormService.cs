using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;
using System.Text;
using System.Text.Json;

namespace NovaLanding.Services;

public class FormService : IFormService
{
    private readonly LandingCmsContext _context;
    private readonly ITelegramService _telegramService;

    public FormService(LandingCmsContext context, ITelegramService telegramService)
    {
        _context = context;
        _telegramService = telegramService;
    }

    public async Task<List<FormResponse>> GetAllFormsAsync()
    {
        var forms = await _context.Forms
            .Include(f => f.Submissions)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        return forms.Select(f => new FormResponse
        {
            Id = f.Id,
            Name = f.Name,
            Description = f.Description,
            FieldsJson = f.FieldsJson,
            IsActive = f.IsActive,
            UserId = f.UserId,
            CreatedAt = f.CreatedAt,
            UpdatedAt = f.UpdatedAt,
            SubmissionCount = f.Submissions.Count
        }).ToList();
    }

    public async Task<FormResponse> GetFormByIdAsync(long id)
    {
        var form = await _context.Forms
            .Include(f => f.Submissions)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            throw new KeyNotFoundException("Form not found");

        return new FormResponse
        {
            Id = form.Id,
            Name = form.Name,
            Description = form.Description,
            FieldsJson = form.FieldsJson,
            IsActive = form.IsActive,
            UserId = form.UserId,
            CreatedAt = form.CreatedAt,
            UpdatedAt = form.UpdatedAt,
            SubmissionCount = form.Submissions.Count
        };
    }

    public async Task<FormResponse> CreateFormAsync(long userId, FormRequest request)
    {
        var form = new Form
        {
            Name = request.Name,
            Description = request.Description,
            FieldsJson = request.FieldsJson,
            IsActive = request.IsActive,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Forms.Add(form);
        await _context.SaveChangesAsync();

        return await GetFormByIdAsync(form.Id);
    }

    public async Task<FormResponse> UpdateFormAsync(long id, FormRequest request)
    {
        var form = await _context.Forms.FindAsync(id);
        if (form == null)
            throw new KeyNotFoundException("Form not found");

        form.Name = request.Name;
        form.Description = request.Description;
        form.FieldsJson = request.FieldsJson;
        form.IsActive = request.IsActive;
        form.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetFormByIdAsync(form.Id);
    }

    public async Task DeleteFormAsync(long id)
    {
        var form = await _context.Forms.FindAsync(id);
        if (form == null)
            throw new KeyNotFoundException("Form not found");

        _context.Forms.Remove(form);
        await _context.SaveChangesAsync();
    }

    public async Task<SubmissionResponse> SubmitFormAsync(SubmissionRequest request, string? ipAddress, string? userAgent)
    {
        var form = await _context.Forms.FindAsync(request.FormId);
        if (form == null || !form.IsActive)
            throw new KeyNotFoundException("Form not found or inactive");

        var submission = new Submission
        {
            FormId = request.FormId,
            DataJson = request.DataJson,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();

        // Send Telegram notification
        try
        {
            await _telegramService.NotifyFormSubmissionAsync(form.Name, request.DataJson);
        }
        catch (Exception)
        {
            // Log but don't fail the submission
        }

        return new SubmissionResponse
        {
            Id = submission.Id,
            FormId = submission.FormId,
            FormName = form.Name,
            DataJson = submission.DataJson,
            IpAddress = submission.IpAddress,
            UserAgent = submission.UserAgent,
            SubmittedAt = submission.SubmittedAt
        };
    }

    public async Task<List<SubmissionResponse>> GetFormSubmissionsAsync(long formId)
    {
        var submissions = await _context.Submissions
            .Include(s => s.Form)
            .Where(s => s.FormId == formId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        return submissions.Select(s => new SubmissionResponse
        {
            Id = s.Id,
            FormId = s.FormId,
            FormName = s.Form.Name,
            DataJson = s.DataJson,
            IpAddress = s.IpAddress,
            UserAgent = s.UserAgent,
            SubmittedAt = s.SubmittedAt
        }).ToList();
    }

    public async Task<byte[]> ExportSubmissionsAsCsvAsync(long formId)
    {
        var submissions = await GetFormSubmissionsAsync(formId);
        
        if (!submissions.Any())
            return Encoding.UTF8.GetBytes("No submissions found");

        var csv = new StringBuilder();
        
        // Parse first submission to get headers
        var firstData = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(submissions[0].DataJson);
        if (firstData != null)
        {
            csv.AppendLine("ID,Submitted At,IP Address," + string.Join(",", firstData.Keys));

            foreach (var submission in submissions)
            {
                var data = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(submission.DataJson);
                var values = data?.Values.Select(v => v.ToString().Replace(",", ";")) ?? new List<string>();
                csv.AppendLine($"{submission.Id},{submission.SubmittedAt},{submission.IpAddress},{string.Join(",", values)}");
            }
        }

        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    public async Task DeleteSubmissionAsync(long id)
    {
        var submission = await _context.Submissions.FindAsync(id);
        if (submission == null)
            throw new KeyNotFoundException("Submission not found");

        _context.Submissions.Remove(submission);
        await _context.SaveChangesAsync();
    }
}
