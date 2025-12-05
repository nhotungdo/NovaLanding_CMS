using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface ITemplateService
{
    Task<BlockTemplateResponse> CreateBlockTemplateAsync(CreateBlockTemplateRequest request);
    Task<BlockTemplateResponse> UpdateBlockTemplateAsync(long id, UpdateBlockTemplateRequest request);
    Task DeleteBlockTemplateAsync(long id);
    Task<BlockTemplateResponse> GetBlockTemplateAsync(long id);
    Task<(List<BlockTemplateResponse> Items, int TotalCount)> GetBlockTemplatesAsync(BlockTemplateFilterRequest filter);
    Task<string> ExportBlockTemplateAsync(long id);
    Task<BlockTemplateResponse> ImportBlockTemplateAsync(string jsonData);
}
