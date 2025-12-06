using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IFormService
{
    Task<List<FormResponse>> GetAllFormsAsync();
    Task<FormResponse> GetFormByIdAsync(long id);
    Task<FormResponse> CreateFormAsync(long userId, FormRequest request);
    Task<FormResponse> UpdateFormAsync(long id, FormRequest request);
    Task DeleteFormAsync(long id);
    Task<SubmissionResponse> SubmitFormAsync(SubmissionRequest request, string? ipAddress, string? userAgent);
    Task<List<SubmissionResponse>> GetFormSubmissionsAsync(long formId);
    Task<byte[]> ExportSubmissionsAsCsvAsync(long formId);
    Task DeleteSubmissionAsync(long id);
}
