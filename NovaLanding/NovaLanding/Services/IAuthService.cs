using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> GoogleLoginAsync(GoogleLoginRequest request);
    Task<UserProfileResponse> GetProfileAsync(long userId);
    Task<UserProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request);
    Task LinkTelegramAsync(long userId, LinkTelegramRequest request);
    string GenerateJwtToken(long userId, string email, string role);
}
