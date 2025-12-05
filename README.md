<div align="center">

# 🚀 NovaLanding CMS

### Modern Landing Page Builder & Content Management System

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4)](https://docs.microsoft.com/aspnet/core)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927?logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![Entity Framework](https://img.shields.io/badge/EF%20Core-8.0-512BD4)](https://docs.microsoft.com/ef/core)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=json-web-tokens)](https://jwt.io/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-26A5E4?logo=telegram)](https://core.telegram.org/bots/api)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#)

**NovaLanding** is a powerful, no-code landing page builder that empowers marketers to create stunning landing pages without writing a single line of code. Built with ASP.NET Core 8, it features a drag-and-drop interface, real-time Telegram notifications, and comprehensive lead management.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-endpoints)

</div>

---

## ✨ Features

### 🎨 **No-Code Page Builder**
- Drag-and-drop section builder with pre-built templates
- Real-time preview and editing
- Responsive design out of the box
- Custom styling and branding options
- SEO-friendly page generation

### 🔐 **Authentication & Security**
- Traditional email/password registration
- Google OAuth 2.0 integration
- JWT token-based authentication
- BCrypt password encryption
- Role-based access control (Admin/Marketer)
- Secure API endpoints with authorization

### 📱 **Telegram Integration**
- Real-time notifications for:
  - New user registrations
  - User login events
  - Page publishing
  - New lead submissions
- Admin and user notifications
- Customizable message templates

### 📊 **Lead Management**
- Capture leads from landing page forms
- Custom form field configuration
- Lead tracking and analytics
- Export leads to CSV
- Telegram notifications for new leads

### 🖼️ **Media Management**
- Upload and organize images
- Image optimization
- CDN-ready file serving
- Drag-and-drop upload interface

### 🎯 **Template System**
- Pre-built section templates (Hero, CTA, Form, Text, Image)
- Template import/export (JSON)
- Custom template creation
- Template versioning

### 📈 **Analytics & Tracking**
- Page view tracking
- Lead conversion metrics
- IP address logging
- User agent tracking

---

## 🎯 Use Cases

| User Type | Use Case | Benefit |
|-----------|----------|---------|
| **Marketers** | Create landing pages for campaigns | No coding required, fast deployment |
| **Agencies** | Build client landing pages | Multi-user support, white-label ready |
| **Startups** | Launch product pages quickly | Cost-effective, professional results |
| **E-commerce** | Create promotional pages | Lead capture, conversion tracking |

## 🚀 Quick Start

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2019+](https://www.microsoft.com/sql-server)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NovaLanding.git
   cd NovaLanding
   ```

2. **Configure the database**
   
   Update `appsettings.json` with your SQL Server connection:
   ```json
   {
     "ConnectionStrings": {
       "DBDefault": "Server=YOUR_SERVER;Database=landing_cms;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
     }
   }
   ```

3. **Run the database script**
   ```bash
   # Execute the SQL script to create database and tables
   sqlcmd -S YOUR_SERVER -U sa -P YOUR_PASSWORD -i NovaLanding/landing_cms.sql
   ```

4. **Configure JWT & OAuth**
   
   Update `appsettings.json`:
   ```json
   {
     "Jwt": {
       "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
       "Issuer": "NovaLanding",
       "Audience": "NovaLanding"
     },
     "Authentication": {
       "Google": {
         "ClientId": "YOUR_GOOGLE_CLIENT_ID",
         "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
       }
     }
   }
   ```

5. **Configure Telegram (Optional)**
   ```json
   {
     "Telegram": {
       "BotToken": "YOUR_BOT_TOKEN",
       "AdminChatId": "YOUR_CHAT_ID"
     }
   }
   ```

6. **Restore packages and run**
   ```bash
   cd NovaLanding/NovaLanding
   dotnet restore
   dotnet build
   dotnet run
   ```

7. **Restore packages and run**
   ```bash
   cd NovaLanding/NovaLanding
   dotnet restore
   dotnet build
   dotnet run
   ```

8. **Access the application**
   - Application: `https://localhost:5001`
   - Login: `https://localhost:5001/Auth/Login`
   - Dashboard: `https://localhost:5001/Dashboard`

### Quick Start Script

For Windows users, simply run:
```bash
start.bat
```

This will automatically restore packages and start the application.

## 🌟 Why NovaLanding?

| Feature | NovaLanding | Traditional CMS | Custom Development |
|---------|-------------|-----------------|-------------------|
| **Setup Time** | < 10 minutes | Hours | Weeks |
| **Coding Required** | ❌ None | ⚠️ Some | ✅ Extensive |
| **Cost** | 💰 Low | 💰💰 Medium | 💰💰💰 High |
| **Telegram Notifications** | ✅ Built-in | ❌ Plugin needed | ⚠️ Custom build |
| **Lead Management** | ✅ Integrated | ⚠️ Separate tool | ⚠️ Custom build |
| **Template System** | ✅ Drag & Drop | ⚠️ Limited | ✅ Full control |
| **Google OAuth** | ✅ Ready | ⚠️ Setup needed | ⚠️ Custom build |
| **API First** | ✅ RESTful API | ⚠️ Limited | ✅ Custom |
| **Multi-user** | ✅ Role-based | ✅ Yes | ⚠️ Custom build |

## 📖 Usage

### Creating Your First Landing Page

1. **Register an account**
   - Navigate to `/Auth/Register`
   - Fill in your details and create an account

2. **Login to dashboard**
   - Go to `/Auth/Login`
   - Use email/username and password, or sign in with Google

3. **Create a new page**
   - Click "Create New Page" in the dashboard
   - Choose from pre-built templates or start from scratch

4. **Build your page**
   - Drag and drop sections (Hero, Features, CTA, Forms)
   - Customize text, images, and styling
   - Preview in real-time

5. **Publish and share**
   - Click "Publish" to make your page live
   - Get a unique URL to share
   - Track leads and analytics

### Setting Up Telegram Notifications

1. **Create a Telegram bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy your bot token

2. **Get your Chat ID**
   - Start a chat with your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat_id` in the response

3. **Configure in appsettings.json**
   ```json
   {
     "Telegram": {
       "BotToken": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
       "AdminChatId": "123456789"
     }
   }
   ```

4. **Link your account** (Optional for user notifications)
   - Go to `/Profile`
   - Enter your Telegram Chat ID
   - Click "Link Telegram"

See [TELEGRAM_NOTIFICATIONS.md](NovaLanding/TELEGRAM_NOTIFICATIONS.md) for detailed documentation.

## 📸 Screenshots

### Dashboard
The main dashboard provides an overview of your pages, leads, and analytics.

### Page Builder
Drag-and-drop interface for building landing pages with pre-built sections.

### Lead Management
Track and manage all leads captured from your landing pages.

### Template Library
Browse and customize pre-built templates for different sections.

> 💡 **Tip**: Check the `/Pages` directory for all available views and interfaces.

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login with credentials | ❌ |
| `POST` | `/api/auth/google-login` | Login with Google OAuth | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `POST` | `/api/auth/link-telegram` | Link Telegram account | ✅ |

### Pages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/page` | Get all pages | ✅ |
| `GET` | `/api/page/{id}` | Get page by ID | ✅ |
| `POST` | `/api/page` | Create new page | ✅ |
| `PUT` | `/api/page/{id}` | Update page | ✅ |
| `DELETE` | `/api/page/{id}` | Delete page | ✅ |
| `POST` | `/api/page/{id}/publish` | Publish page | ✅ |
| `POST` | `/api/page/{id}/unpublish` | Unpublish page | ✅ |

### Templates (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/template` | Get all templates | ✅ Admin |
| `GET` | `/api/template/{id}` | Get template by ID | ✅ Admin |
| `POST` | `/api/template` | Create template | ✅ Admin |
| `PUT` | `/api/template/{id}` | Update template | ✅ Admin |
| `DELETE` | `/api/template/{id}` | Delete template | ✅ Admin |
| `GET` | `/api/template/{id}/export` | Export as JSON | ✅ Admin |
| `POST` | `/api/template/import` | Import from JSON | ✅ Admin |

### Leads

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/lead` | Get all leads | ✅ |
| `GET` | `/api/lead/{id}` | Get lead by ID | ✅ |
| `POST` | `/api/lead/submit` | Submit form (public) | ❌ |
| `GET` | `/api/lead/export` | Export leads to CSV | ✅ |

### Media

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/media` | Get all media files | ✅ |
| `GET` | `/api/media/{id}` | Get media by ID | ✅ |
| `POST` | `/api/media/upload` | Upload file | ✅ |
| `DELETE` | `/api/media/{id}` | Delete file | ✅ |

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/view/{slug}` | View published page | ❌ |
| `POST` | `/api/public/submit-lead` | Submit lead form | ❌ |

## 🏗️ Architecture

### Tech Stack

**Backend**
- ASP.NET Core 8.0 (Razor Pages + Web API)
- Entity Framework Core 8.0
- SQL Server 2019+
- JWT Authentication
- BCrypt Password Hashing

**Frontend**
- Razor Pages (Server-side rendering)
- Bootstrap 5
- JavaScript (Vanilla)
- Google OAuth 2.0

**Integrations**
- Telegram Bot API
- Google OAuth 2.0
- HttpClient for external APIs

### Project Structure

```
NovaLanding/
├── NovaLanding/
│   ├── Controllers/              # API Controllers
│   │   ├── AuthController.cs     # Authentication endpoints
│   │   ├── PageController.cs     # Page management
│   │   ├── TemplateController.cs # Template CRUD
│   │   ├── MediaController.cs    # File uploads
│   │   ├── LeadController.cs     # Lead management
│   │   └── PublicController.cs   # Public page viewing
│   ├── Services/                 # Business logic layer
│   │   ├── IAuthService.cs
│   │   ├── AuthService.cs
│   │   ├── ITelegramService.cs
│   │   ├── TelegramService.cs
│   │   ├── IPageService.cs
│   │   ├── PageService.cs
│   │   ├── ITemplateService.cs
│   │   ├── TemplateService.cs
│   │   ├── IMediaService.cs
│   │   ├── MediaService.cs
│   │   ├── ILeadService.cs
│   │   └── LeadService.cs
│   ├── Models/                   # Entity models
│   │   ├── LandingCmsContext.cs  # EF Core DbContext
│   │   ├── User.cs
│   │   ├── Page.cs
│   │   ├── PageSection.cs
│   │   ├── BlocksTemplate.cs
│   │   ├── Medium.cs
│   │   ├── Lead.cs
│   │   └── PageView.cs
│   ├── DTOs/                     # Data Transfer Objects
│   │   ├── AuthDTOs.cs
│   │   ├── PageDTOs.cs
│   │   ├── TemplateDTOs.cs
│   │   ├── MediaDTOs.cs
│   │   └── LeadDTOs.cs
│   ├── Middleware/
│   │   └── RoleAuthorizationAttribute.cs
│   ├── Pages/                    # Razor Pages
│   │   ├── Auth/
│   │   │   ├── Login.cshtml
│   │   │   └── Register.cshtml
│   │   ├── Pages/
│   │   │   ├── Index.cshtml
│   │   │   └── Builder.cshtml
│   │   ├── Admin/
│   │   │   └── Templates.cshtml
│   │   ├── Leads/
│   │   │   └── Index.cshtml
│   │   ├── Media/
│   │   │   └── Index.cshtml
│   │   ├── Dashboard.cshtml
│   │   └── Profile.cshtml
│   ├── wwwroot/                  # Static files
│   │   ├── css/
│   │   ├── js/
│   │   └── uploads/
│   ├── Database/                 # SQL scripts
│   │   ├── create_leads_tables.sql
│   │   └── sample_form_template.sql
│   ├── appsettings.json
│   └── Program.cs
├── landing_cms.sql               # Database schema
├── SETUP.md                      # Setup guide
├── TELEGRAM_NOTIFICATIONS.md     # Telegram integration docs
└── README.md
```

### Design Patterns

- **Service Layer Pattern**: Business logic separated from controllers
- **Repository Pattern**: Data access through EF Core DbContext
- **Dependency Injection**: All services registered in Program.cs
- **DTO Pattern**: Data transfer objects for API requests/responses
- **Middleware Pattern**: Custom authorization attributes

## 🗄️ Database Schema

### Core Tables

**users**
- `id` (bigint, PK)
- `email` (varchar, unique)
- `username` (varchar, unique)
- `password` (varchar, hashed)
- `role` (varchar: admin/marketer)
- `telegram_chat_id` (bigint, nullable)
- `created_at`, `updated_at`

**pages**
- `id` (bigint, PK)
- `user_id` (bigint, FK)
- `title`, `slug` (varchar, unique)
- `meta_title`, `meta_description`
- `is_published` (bit)
- `created_at`, `updated_at`

**page_sections**
- `id` (bigint, PK)
- `page_id` (bigint, FK)
- `template_id` (bigint, FK)
- `content` (nvarchar(max), JSON)
- `order_index` (int)
- `is_visible` (bit)

**blocks_templates**
- `id` (bigint, PK)
- `name`, `type` (varchar)
- `html_template` (nvarchar(max))
- `css_template` (nvarchar(max))
- `js_template` (nvarchar(max))
- `default_content` (nvarchar(max), JSON)

**leads**
- `id` (bigint, PK)
- `page_id` (bigint, FK)
- `form_data` (nvarchar(max), JSON)
- `ip_address` (varchar)
- `user_agent` (varchar)
- `created_at`

**media**
- `id` (bigint, PK)
- `user_id` (bigint, FK)
- `filename`, `file_path`
- `file_size` (bigint)
- `mime_type` (varchar)
- `created_at`

**page_views**
- `id` (bigint, PK)
- `page_id` (bigint, FK)
- `ip_address`, `user_agent`
- `viewed_at`

## 🔒 Security

### Authentication
- JWT tokens with 7-day expiration
- BCrypt password hashing (cost factor: 11)
- Secure token validation
- HTTPS enforcement

### Authorization
- Role-based access control (RBAC)
- Custom authorization attributes
- Protected API endpoints
- Admin-only routes

### Data Protection
- SQL injection prevention (EF Core parameterized queries)
- XSS protection (HTML encoding)
- CORS configuration
- File upload validation
- Input sanitization

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letters
- Must contain lowercase letters
- Must contain numbers

## 📚 Documentation

- **[Setup Guide](NovaLanding/SETUP.md)** - Complete installation instructions
- **[Telegram Notifications](NovaLanding/TELEGRAM_NOTIFICATIONS.md)** - Telegram integration guide
- **[Features Complete](NovaLanding/FEATURES_COMPLETE.txt)** - Implemented features list

## 🤝 Contributing

This is a private project. For contribution guidelines, please contact the project maintainers.

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## 🛠️ Development

### Running in Development

```bash
cd NovaLanding/NovaLanding
dotnet watch run
```

### Building for Production

```bash
dotnet publish -c Release -o ./publish
```

### Database Migrations

```bash
# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure database exists

**JWT Token Invalid**
- Check JWT key is at least 32 characters
- Verify token hasn't expired
- Clear browser localStorage

**Google Login Not Working**
- Verify Client ID in `appsettings.json`
- Check authorized origins in Google Console
- Ensure redirect URIs are configured

**Telegram Notifications Not Sent**
- Verify bot token is correct
- Check admin chat ID
- Ensure bot is not blocked
- Review application logs

## ✅ Getting Started Checklist

After installation, follow this checklist:

- [ ] Configure database connection in `appsettings.json`
- [ ] Run database script (`landing_cms.sql`)
- [ ] Update JWT secret key (minimum 32 characters)
- [ ] Configure Google OAuth credentials (optional)
- [ ] Set up Telegram bot and get bot token (optional)
- [ ] Create your first admin user
- [ ] Login and explore the dashboard
- [ ] Create your first landing page
- [ ] Test lead form submission
- [ ] Configure Telegram notifications

## 🎓 Learning Resources

- **[Setup Guide](NovaLanding/SETUP.md)** - Step-by-step installation
- **[Telegram Integration](NovaLanding/TELEGRAM_NOTIFICATIONS.md)** - Configure notifications
- **API Endpoints** - See [API Reference](#-api-endpoints) section above
- **Database Schema** - See [Database Schema](#-database-schema) section above

## 🚦 Roadmap

Future enhancements planned:

- [ ] Email notifications
- [ ] A/B testing for landing pages
- [ ] Advanced analytics dashboard
- [ ] Template marketplace
- [ ] Multi-language support
- [ ] Custom domain mapping
- [ ] Webhook integrations
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Payment gateway integration
- [ ] Advanced form builder

## 📞 Support

For support, bug reports, or feature requests:

- **Email**: Contact the development team
- **Issues**: Report bugs via project issue tracker
- **Documentation**: Check the `/NovaLanding` folder for detailed guides

## 👥 Team

This project is maintained by a dedicated team of developers focused on empowering marketers with no-code solutions.

## 📋 Quick Reference

### Default Ports
- **HTTPS**: `https://localhost:5001`
- **HTTP**: `http://localhost:5000`

### Default Roles
- `admin` - Full system access
- `marketer` - Create and manage own pages

### Important Files
- `appsettings.json` - Configuration
- `landing_cms.sql` - Database schema
- `start.bat` - Quick start script (Windows)

### Key Directories
- `/Controllers` - API endpoints
- `/Services` - Business logic
- `/Pages` - Razor pages (UI)
- `/wwwroot/uploads` - Uploaded media files

### Environment Variables (Optional)
```bash
ConnectionStrings__DBDefault="Server=...;Database=landing_cms;..."
Jwt__Key="YourSecretKey"
Telegram__BotToken="123456:ABC..."
Telegram__AdminChatId="123456789"
```

---

<div align="center">

### 🌟 Star this repository if you find it helpful!

**Built with ❤️ using ASP.NET Core 8.0**

*Empowering marketers to create beautiful landing pages without code*

[⬆ Back to Top](#-novalanding-cms)

</div>
