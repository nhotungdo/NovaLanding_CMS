using System.ComponentModel.DataAnnotations;

namespace NovaLanding.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Username is required")]
    [MinLength(6, ErrorMessage = "Username must be at least 6 characters")]
    public string Username { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", 
        ErrorMessage = "Password must contain uppercase, lowercase and numbers")]
    public string Password { get; set; } = null!;
}

public class LoginRequest
{
    [Required(ErrorMessage = "Email or Username is required")]
    public string EmailOrUsername { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;
}

public class GoogleLoginRequest
{
    [Required]
    public string IdToken { get; set; } = null!;
}

public class UpdateProfileRequest
{
    [MinLength(6, ErrorMessage = "Username must be at least 6 characters")]
    public string? Username { get; set; }
    
    public string? Avatar { get; set; }
}

public class LinkTelegramRequest
{
    [Required]
    public long TelegramChatId { get; set; }
}

public class AuthResponse
{
    public long UserId { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Token { get; set; } = null!;
}

public class UserProfileResponse
{
    public long Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public long? TelegramChatId { get; set; }
    public DateTime? CreatedAt { get; set; }
}
