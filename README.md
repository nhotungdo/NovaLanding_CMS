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
<!--
  README cho phần frontend của NovaLanding (thư mục: NovaLanding_CMS/NovaLanding_CMS).
  Tập trung: cài đặt nhanh, cấu trúc thư mục, file quan trọng và hướng dẫn dev.
-->

# NovaLanding CMS — Frontend (React + TypeScript)

Phần frontend của NovaLanding — một công cụ xây dựng landing page. Ứng dụng dùng React + TypeScript và chạy trên Vite để phát triển nhanh.

## Tóm tắt

- Tech: React, TypeScript, Vite
- Thư mục chính: `components/`, `services/`, `index.tsx`, `App.tsx`

## Yêu cầu

- Node.js 18+ (LTS khuyến nghị)
- npm hoặc yarn

## Cài đặt & chạy (development)

Trên Windows (PowerShell/CMD):

```powershell
npm install
npm run dev
```

## Build & preview

```powershell
npm run build
npm run preview
```

## Cấu trúc chính

- `index.html` — entry file cho Vite
- `index.tsx`, `App.tsx` — điểm khởi tạo React
- `components/` — các component UI (Editor, SectionPreview, Icons...)
- `services/` — service gọi API / helper (ví dụ `geminiService.ts`)
- `types.ts`, `constants.ts` — kiểu và hằng số chung
- `vite.config.ts`, `tsconfig.json` — cấu hình dự án

## File đáng chú ý

- `components/Editor.tsx` — editor chính để biên tập trang
- `components/SectionPreview.tsx` — xem trước section
- `services/geminiService.ts` — logic gọi API/gemini

## Quy ước

- Viết component nhỏ, rõ ràng, có `Props`/`State` typed.
- Tách logic API vào `services/` để dễ test và mock.

## Gợi ý cải thiện

- Thêm `ENV.md` cho biến môi trường (API_URL, TELEGRAM_TOKEN...)
- Thêm `start.bat` cho Windows (nếu cần)
- Nếu cần tích hợp backend, thêm hướng dẫn proxy trong `vite.config.ts`.

## Muốn tôi làm tiếp?

- Tôi có thể: tạo `start.bat`, thêm tài liệu biến môi trường, hoặc cập nhật README chi tiết hơn.

---

_Đã cập nhật README cho frontend._
| Method | Endpoint | Description | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| `GET` | `/api/lead` | Get all leads | ✅ |
| `GET` | `/api/lead/{id}` | Get lead by ID | ✅ |
| `POST` | `/api/lead/submit` | Submit form (public) | ❌ |
| `GET` | `/api/lead/export` | Export leads to CSV | ✅ |

### Media

| Method   | Endpoint            | Description         | Auth Required |
| -------- | ------------------- | ------------------- | ------------- |
| `GET`    | `/api/media`        | Get all media files | ✅            |
| `GET`    | `/api/media/{id}`   | Get media by ID     | ✅            |
| `POST`   | `/api/media/upload` | Upload file         | ✅            |
| `DELETE` | `/api/media/{id}`   | Delete file         | ✅            |

### Public Endpoints

| Method | Endpoint                  | Description         | Auth Required |
| ------ | ------------------------- | ------------------- | ------------- |
| `GET`  | `/view/{slug}`            | View published page | ❌            |
| `POST` | `/api/public/submit-lead` | Submit lead form    | ❌            |

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
- **[Home Page Quick Start](NovaLanding/QUICK_START_HOME_PAGE.md)** - Get started with the home page in 3 steps
- **[Home Page Documentation](NovaLanding/HOME_PAGE_DOCUMENTATION.md)** - Detailed home page features and customization
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

_Empowering marketers to create beautiful landing pages without code_

[⬆ Back to Top](#-novalanding-cms)

</div>
