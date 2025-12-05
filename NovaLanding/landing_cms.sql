-- Tạo database
CREATE DATABASE landing_cms;
GO

USE landing_cms;
GO

-- Bảng users
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'marketer' CHECK (role IN ('admin', 'marketer')),
    telegram_chat_id BIGINT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Trigger để tự động cập nhật updated_at (tùy chọn)
CREATE TRIGGER trg_users_updated_at
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE users
    SET updated_at = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

-- Bảng blocks_templates
CREATE TABLE blocks_templates (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('hero', 'text', 'image', 'form', 'cta')),
    default_html NVARCHAR(MAX),
    description NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Bảng pages
CREATE TABLE pages (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    slug NVARCHAR(100) UNIQUE NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    user_id BIGINT NOT NULL,
    published_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- Trigger cho updated_at của pages
CREATE TRIGGER trg_pages_updated_at
ON pages
AFTER UPDATE
AS
BEGIN
    UPDATE pages
    SET updated_at = GETDATE()
    FROM pages p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Bảng page_sections
CREATE TABLE page_sections (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    page_id BIGINT NOT NULL,
    block_template_id BIGINT NOT NULL,
    order_num INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    custom_content NVARCHAR(MAX),  -- Lưu JSON dưới dạng text, có thể dùng ISJSON() để validate
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (block_template_id) REFERENCES blocks_templates(id) ON DELETE NO ACTION,
    CONSTRAINT unique_order_per_page UNIQUE (page_id, order_num)
);
GO

-- Trigger cho updated_at của page_sections
CREATE TRIGGER trg_page_sections_updated_at
ON page_sections
AFTER UPDATE
AS
BEGIN
    UPDATE page_sections
    SET updated_at = GETDATE()
    FROM page_sections ps
    INNER JOIN inserted i ON ps.id = i.id;
END;
GO

-- Bảng media
CREATE TABLE media (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    filename NVARCHAR(200) NOT NULL,
    path NVARCHAR(500) NOT NULL,
    mime_type NVARCHAR(50) NOT NULL,
    size BIGINT,
    user_id BIGINT NOT NULL,
    uploaded_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- Tạo index để tối ưu (tương tự MySQL)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_blocks_templates_type ON blocks_templates(type);
CREATE INDEX idx_pages_status_slug ON pages(status, slug);
CREATE INDEX idx_page_sections_page_order ON page_sections(page_id, order_num);
CREATE INDEX idx_media_filename_user ON media(filename, user_id);
GO

