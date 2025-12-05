# NovaLanding - Setup Guide

## Features Implemented

### 1. Authentication & User Management
- ✅ Traditional registration with email, username, and password validation
- ✅ Login with email or username
- ✅ Google OAuth 2.0 integration
- ✅ JWT token-based authentication
- ✅ Password encryption using BCrypt
- ✅ Profile management
- ✅ Telegram account linking
- ✅ Role-based access control (Admin/Marketer)

### 2. Template Management (Admin Only)
- ✅ Create, Read, Update, Delete block templates
- ✅ Template classification by type (Hero, Text, Image, Form, CTA)
- ✅ Search and filter templates
- ✅ Export templates as JSON
- ✅ Import templates from JSON
- ✅ Pagination support

## Prerequisites

- .NET 8.0 SDK
- SQL Server
- Visual Studio 2022 or VS Code

## Installation Steps

### 1. Restore NuGet Packages

```bash
cd NovaLanding/NovaLanding
dotnet restore
```

### 2. Configure Database Connection

Update `appsettings.json` with your SQL Server connection string:

```json
"ConnectionStrings": {
  "DBDefault": "YOUR_CONNECTION_STRING_HERE"
}
```

### 3. Configure JWT Settings

Update the JWT key in `appsettings.json` (use a strong secret key):

```json
"Jwt": {
  "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
  "Issuer": "NovaLanding",
  "Audience": "NovaLandingUsers"
}
```

### 4. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins and redirect URIs
6. Copy the Client ID and update `appsettings.json`:

```json
"Google": {
  "ClientId": "YOUR_GOOGLE_CLIENT_ID_HERE"
}
```

7. Update the Client ID in `Pages/Auth/Login.cshtml`:
```html
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleGoogleLogin">
</div>
```

### 5. Run Database Migrations

The database schema should already exist from your SQL file. If not, run:

```bash
dotnet ef database update
```

### 6. Build and Run

```bash
dotnet build
dotnet run
```

The application will start at `https://localhost:5001` (or the port specified in launchSettings.json)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google-login` - Login with Google
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `POST /api/auth/link-telegram` - Link Telegram account (requires auth)

### Template Management (Admin only)

- `GET /api/template` - Get all templates with filters
- `GET /api/template/{id}` - Get template by ID
- `POST /api/template` - Create new template
- `PUT /api/template/{id}` - Update template
- `DELETE /api/template/{id}` - Delete template
- `GET /api/template/{id}/export` - Export template as JSON
- `POST /api/template/import` - Import template from JSON

## Pages

- `/Auth/Register` - User registration
- `/Auth/Login` - User login
- `/Dashboard` - User dashboard
- `/Profile` - User profile management
- `/Admin/Templates` - Template management (Admin only)

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letters
- Must contain lowercase letters
- Must contain numbers
- Encrypted with BCrypt before storage

### Username Requirements
- Minimum 6 characters
- Must be unique

### Email Requirements
- Valid email format
- Must be unique

### Authorization
- JWT token-based authentication
- Role-based access control
- Admin role: Full system access
- Marketer role: Limited to own resources

## Testing the Application

### 1. Register a New User
1. Navigate to `/Auth/Register`
2. Fill in email, username, and password
3. Submit the form
4. You'll be redirected to the dashboard

### 2. Login
1. Navigate to `/Auth/Login`
2. Enter email/username and password
3. Or click "Sign in with Google"
4. You'll be redirected to the dashboard

### 3. Manage Templates (Admin Only)
1. Create an admin user in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```
2. Login as admin
3. Navigate to `/Admin/Templates`
4. Create, edit, or delete templates

### 4. Link Telegram
1. Create a Telegram bot using BotFather
2. Get your chat ID by messaging the bot
3. Navigate to `/Profile`
4. Enter your Telegram Chat ID
5. Click "Link Telegram"

## Telegram Bot Setup (Optional)

To enable Telegram notifications:

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get the bot token
3. Create a simple bot that captures chat IDs
4. Users can get their chat ID by messaging `/start` to your bot

Example bot code (Node.js):
```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Your Chat ID is: ${chatId}`);
});
```

## Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure database exists and tables are created

### JWT Token Issues
- Ensure JWT key is at least 32 characters
- Check token expiration (default: 7 days)
- Clear browser localStorage if needed

### Google Login Issues
- Verify Client ID is correct
- Check authorized origins in Google Console
- Ensure Google+ API is enabled

## Next Steps

Consider implementing:
- Email verification
- Password reset functionality
- Two-factor authentication
- Activity logging
- Rate limiting for API endpoints
- Refresh token mechanism
- Template versioning system
- Template preview functionality
