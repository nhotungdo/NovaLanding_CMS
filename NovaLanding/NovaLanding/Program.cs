using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using NovaLanding.Models;
using NovaLanding.Services;
using NovaLanding.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

// Database
builder.Services.AddDbContext<LandingCmsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBDefault")));

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<IPageService, PageService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<ITelegramService, TelegramService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// HttpClient for Telegram API
builder.Services.AddHttpClient();

// Memory Cache for page rendering
builder.Services.AddMemoryCache();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "NovaLanding CMS API",
        Version = "v1",
        Description = "Complete API for NovaLanding CMS - Landing Page Builder with Blog, Forms, and Media Management"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "NovaLanding CMS API v1");
        c.RoutePrefix = "swagger";
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Global Exception Handling
app.UseMiddleware<GlobalExceptionMiddleware>();

// Activity Logging (optional - can be enabled/disabled)
// app.UseMiddleware<ActivityLoggingMiddleware>();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// Home page is routed directly via Razor Pages (Index at route "/")

app.MapRazorPages();
app.MapControllers();

// Handle 404 errors - redirect to home page
app.Use(async (context, next) =>
{
    await next();
    
    if (context.Response.StatusCode == 404 && !context.Response.HasStarted)
    {
        var path = context.Request.Path.Value;
        
        // Don't redirect API calls or static files
        if (!path.StartsWith("/api") && !path.StartsWith("/view") && 
            !path.Contains(".") && !context.Request.Path.StartsWithSegments("/swagger"))
        {
            context.Response.Redirect("/");
        }
    }
});

app.Run();
