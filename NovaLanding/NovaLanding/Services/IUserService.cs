using NovaLanding.DTOs;

namespace NovaLanding.Services;

public interface IUserService
{
    Task<List<UserResponse>> GetAllUsersAsync();
    Task<UserResponse> GetUserByIdAsync(long id);
    Task<UserResponse> CreateUserAsync(UserCreateRequest request);
    Task<UserResponse> UpdateUserAsync(long id, UserUpdateRequest request);
    Task DeleteUserAsync(long id);
}
