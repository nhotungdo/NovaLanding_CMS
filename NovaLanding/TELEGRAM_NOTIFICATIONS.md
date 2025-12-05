# Telegram Notifications Guide

## Overview
The NovaLanding CMS includes a complete Telegram notification system that sends real-time alerts for important events like user registration, login, page publishing, and new leads.

## Features Implemented

### 1. User Login Notifications
When a user logs in, two notifications are sent:

**To User (if Telegram is linked):**
- 🔐 Security alert with login details
- Email address
- IP address
- Timestamp
- Security warning message

**To Admin:**
- 🔔 Login event notification
- User email and ID
- IP address
- Timestamp

### 2. User Registration Notifications
When a new user registers, two notifications are sent:

**To User (if Telegram is linked):**
- 🎉 Welcome message
- Account confirmation
- Registration timestamp
- Encouragement to start creating pages

**To Admin:**
- 🆕 New registration alert
- User email
- IP address
- Timestamp

### 3. Page Publishing Notifications
When a user publishes a landing page:
- ✅ Success confirmation
- Page title and URL
- Publication timestamp

### 4. New Lead Notifications
When a form is submitted on a landing page:
- 🎯 New lead alert
- Page name
- Complete form data
- Timestamp
- Call to action for follow-up

## Configuration

### 1. Set Up Telegram Bot
Edit `appsettings.json`:

```json
{
  "Telegram": {
    "BotToken": "YOUR_BOT_TOKEN_HERE",
    "AdminChatId": "YOUR_ADMIN_CHAT_ID_HERE"
  }
}
```

### 2. Get Your Bot Token
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token provided

### 3. Get Your Chat ID
1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your `chat_id` in the response

### 4. Link User Telegram Account
Users can link their Telegram account via the API:

**Endpoint:** `POST /api/auth/link-telegram`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "telegramChatId": 123456789
}
```

## How It Works

### Service Architecture
```
AuthController → AuthService → TelegramService → Telegram API
```

1. **ITelegramService Interface**: Defines all notification methods
2. **TelegramService**: Implements notification logic
3. **AuthService**: Calls TelegramService during login/registration
4. **LeadService**: Calls TelegramService for new leads
5. **PageService**: Calls TelegramService for page publishing

### Error Handling
- All Telegram notifications are wrapped in try-catch blocks
- Failures are logged but don't interrupt the main operation
- If bot token is missing, warnings are logged
- If user hasn't linked Telegram, notifications are skipped gracefully

## Testing

### Test Login Notification
1. Configure bot token and admin chat ID
2. Login to the application
3. Check Telegram for notifications

### Test Registration Notification
1. Register a new account
2. Admin should receive notification immediately
3. Link Telegram to receive user notifications

### Test Lead Notification
1. Create and publish a landing page
2. Submit a form on the page
3. Check Telegram for lead notification

## Message Format

All messages use HTML formatting for better readability:
- **Bold text** for headers and important fields
- Emojis for visual categorization
- Structured layout with clear sections
- UTC timestamps for consistency

## Security Notes

1. **Bot Token**: Keep your bot token secret
2. **Chat IDs**: Only authorized users should have access
3. **IP Logging**: IP addresses are logged for security tracking
4. **User Privacy**: Only send notifications to users who have opted in by linking Telegram

## Troubleshooting

### Notifications Not Received
1. Verify bot token is correct in `appsettings.json`
2. Check that chat ID is correct
3. Ensure bot is not blocked by user
4. Check application logs for errors

### Admin Notifications Not Working
1. Verify `AdminChatId` is set correctly
2. Start a conversation with the bot first
3. Check bot has permission to send messages

### User Notifications Not Working
1. User must link their Telegram account first
2. Use `/api/auth/link-telegram` endpoint
3. Verify `TelegramChatId` is saved in database

## API Reference

### ITelegramService Methods

```csharp
// Send a message to any chat
Task SendMessageAsync(long chatId, string message);

// Notify user about their login
Task NotifyLoginAsync(long userId, string email, string ipAddress);

// Notify admin about user login
Task NotifyAdminLoginAsync(long userId, string email, string ipAddress);

// Notify user about successful registration
Task NotifyRegistrationAsync(long userId, string email);

// Notify admin about new registration
Task NotifyAdminRegistrationAsync(string email, string ipAddress);

// Notify user about page publishing
Task NotifyPagePublishedAsync(long userId, string pageTitle, string pageSlug);

// Notify user about new lead
Task NotifyNewLeadAsync(long userId, string pageTitle, Dictionary<string, string> formData);
```

## Future Enhancements

Potential improvements:
- Notification preferences (enable/disable specific types)
- Custom message templates
- Multi-language support
- Notification history
- Webhook support for instant delivery
- Group chat support for team notifications
