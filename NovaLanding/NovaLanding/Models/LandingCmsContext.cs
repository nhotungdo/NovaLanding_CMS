using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NovaLanding.Models;

public partial class LandingCmsContext : DbContext
{
    public LandingCmsContext()
    {
    }

    public LandingCmsContext(DbContextOptions<LandingCmsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BlocksTemplate> BlocksTemplates { get; set; }

    public virtual DbSet<Medium> Media { get; set; }

    public virtual DbSet<Page> Pages { get; set; }

    public virtual DbSet<PageSection> PageSections { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Lead> Leads { get; set; }

    public virtual DbSet<PageView> PageViews { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=NHOTUNG\\SQLEXPRESS;Database=landing_cms;User Id=sa;Password=123;TrustServerCertificate=true;Trusted_Connection=SSPI;Encrypt=false;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlocksTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__blocks_t__3213E83F92C29F8D");

            entity.ToTable("blocks_templates");

            entity.HasIndex(e => e.Type, "idx_blocks_templates_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.DefaultHtml).HasColumnName("default_html");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");
        });

        modelBuilder.Entity<Medium>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__media__3213E83FE5E505A0");

            entity.ToTable("media");

            entity.HasIndex(e => new { e.Filename, e.UserId }, "idx_media_filename_user");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Filename)
                .HasMaxLength(200)
                .HasColumnName("filename");
            entity.Property(e => e.MimeType)
                .HasMaxLength(50)
                .HasColumnName("mime_type");
            entity.Property(e => e.Path)
                .HasMaxLength(500)
                .HasColumnName("path");
            entity.Property(e => e.Size).HasColumnName("size");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("uploaded_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Media)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__media__user_id__5812160E");
        });

        modelBuilder.Entity<Page>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__pages__3213E83FF8FCE969");

            entity.ToTable("pages", tb => tb.HasTrigger("trg_pages_updated_at"));

            entity.HasIndex(e => e.Slug, "UQ__pages__32DD1E4CB253B3E2").IsUnique();

            entity.HasIndex(e => new { e.Status, e.Slug }, "idx_pages_status_slug");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.PublishedAt).HasColumnName("published_at");
            entity.Property(e => e.Slug)
                .HasMaxLength(100)
                .HasColumnName("slug");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Pages)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__pages__user_id__49C3F6B7");
        });

        modelBuilder.Entity<PageSection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__page_sec__3213E83FD1090CAD");

            entity.ToTable("page_sections", tb => tb.HasTrigger("trg_page_sections_updated_at"));

            entity.HasIndex(e => new { e.PageId, e.OrderNum }, "idx_page_sections_page_order");

            entity.HasIndex(e => new { e.PageId, e.OrderNum }, "unique_order_per_page").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BlockTemplateId).HasColumnName("block_template_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.CustomContent).HasColumnName("custom_content");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.OrderNum)
                .HasDefaultValue(0)
                .HasColumnName("order_num");
            entity.Property(e => e.PageId).HasColumnName("page_id");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.BlockTemplate).WithMany(p => p.PageSections)
                .HasForeignKey(d => d.BlockTemplateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__page_sect__block__534D60F1");

            entity.HasOne(d => d.Page).WithMany(p => p.PageSections)
                .HasForeignKey(d => d.PageId)
                .HasConstraintName("FK__page_sect__page___52593CB8");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__users__3213E83F3B1425FF");

            entity.ToTable("users", tb => tb.HasTrigger("trg_users_updated_at"));

            entity.HasIndex(e => e.Email, "UQ__users__AB6E616485A44A47").IsUnique();

            entity.HasIndex(e => e.Username, "UQ__users__F3DBC57201C7E62C").IsUnique();

            entity.HasIndex(e => e.Email, "idx_users_email");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValue("marketer")
                .HasColumnName("role");
            entity.Property(e => e.TelegramChatId).HasColumnName("telegram_chat_id");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__leads__3213E83F");

            entity.ToTable("leads");

            entity.HasIndex(e => e.PageId, "idx_leads_page_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PageId).HasColumnName("page_id");
            entity.Property(e => e.FormData).HasColumnName("form_data");
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("submitted_at");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .HasColumnName("ip_address");

            entity.HasOne(d => d.Page).WithMany(p => p.Leads)
                .HasForeignKey(d => d.PageId)
                .HasConstraintName("FK__leads__page_id");
        });

        modelBuilder.Entity<PageView>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__page_views__3213E83F");

            entity.ToTable("page_views");

            entity.HasIndex(e => e.PageId, "idx_page_views_page_id");
            entity.HasIndex(e => e.ViewedAt, "idx_page_views_viewed_at");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PageId).HasColumnName("page_id");
            entity.Property(e => e.ViewedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("viewed_at");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .HasColumnName("ip_address");
            entity.Property(e => e.UserAgent)
                .HasMaxLength(500)
                .HasColumnName("user_agent");

            entity.HasOne(d => d.Page).WithMany(p => p.PageViews)
                .HasForeignKey(d => d.PageId)
                .HasConstraintName("FK__page_views__page_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
