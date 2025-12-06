using Microsoft.EntityFrameworkCore;
using NovaLanding.DTOs;
using NovaLanding.Models;

namespace NovaLanding.Services;

public class UserService : IUserService
{
    private readonly LandingCmsContext _context;

    public UserService(LandingCmsContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponse>> GetAllUsersAsync()
    {
        var users = await _context.Users.OrderBy(u => u.Username).ToListAsync();
        return users.Select(MapToResponse).ToList();
    }

    public async Task<UserResponse> GetUserByIdAsync(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        return MapToResponse(user);
    }

    public async Task<UserResponse> CreateUserAsync(UserCreateRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already exists");

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            throw new InvalidOperationException("Username already exists");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return MapToResponse(user);
    }

    public async Task<UserResponse> UpdateUserAsync(long id, UserUpdateRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        if (!string.IsNullOrEmpty(request.Username))
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != id))
                throw new InvalidOperationException("Username already exists");
            user.Username = request.Username;
        }

        if (!string.IsNullOrEmpty(request.Email))
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
                throw new InvalidOperationException("Email already exists");
            user.Email = request.Email;
        }

        if (!string.IsNullOrEmpty(request.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        if (!string.IsNullOrEmpty(request.Role))
        {
            user.Role = request.Role;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToResponse(user);
    }

    public async Task DeleteUserAsync(long id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    private UserResponse MapToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            TelegramChatId = user.TelegramChatId,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
