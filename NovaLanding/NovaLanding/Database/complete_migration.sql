-- NovaLanding CMS Complete Database Migration
-- Run this script to create all missing tables

USE landing_cms;
GO

-- Create Roles table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'roles')
BEGIN
    CREATE TABLE roles (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(50) NOT NULL UNIQUE,
        description NVARCHAR(200),
        created_at DATETIME DEFAULT GETDATE()
    );

    -- Insert default roles
    INSERT INTO roles (name, description) VALUES 
    ('admin', 'Full system access'),
    ('editor', 'Can create and edit content'),
    ('marketer', 'Can create landing pages and view analytics');
END
GO

-- Create RefreshTokens table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'refresh_tokens')
BEGIN
    CREATE TABLE refresh_tokens (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        user_id BIGINT NOT NULL,
        token NVARCHAR(500) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        is_revoked BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
    CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
END
GO

-- Create Posts table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'posts')
BEGIN
    CREATE TABLE posts (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        title NVARCHAR(200) NOT NULL,
        slug NVARCHAR(200) NOT NULL UNIQUE,
        content NVARCHAR(MAX),
        excerpt NVARCHAR(500),
        thumbnail_id BIGINT,
        status NVARCHAR(20) DEFAULT 'draft',
        user_id BIGINT NOT NULL,
        published_at DATETIME,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (thumbnail_id) REFERENCES media(id)
    );

    CREATE INDEX idx_posts_slug ON posts(slug);
    CREATE INDEX idx_posts_status ON posts(status);
    CREATE INDEX idx_posts_user ON posts(user_id);
END
GO

-- Create Categories table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(500),
        created_at DATETIME DEFAULT GETDATE()
    );

    CREATE INDEX idx_categories_slug ON categories(slug);
END
GO

-- Create Tags table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tags')
BEGIN
    CREATE TABLE tags (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT GETDATE()
    );

    CREATE INDEX idx_tags_slug ON tags(slug);
END
GO

-- Create PostCategories junction table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'post_categories')
BEGIN
    CREATE TABLE post_categories (
        post_id BIGINT NOT NULL,
        category_id BIGINT NOT NULL,
        PRIMARY KEY (post_id, category_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
END
GO

-- Create PostTags junction table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'post_tags')
BEGIN
    CREATE TABLE post_tags (
        post_id BIGINT NOT NULL,
        tag_id BIGINT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
END
GO

-- Create Menus table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'menus')
BEGIN
    CREATE TABLE menus (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        location NVARCHAR(50) NOT NULL,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );

    CREATE INDEX idx_menus_location ON menus(location);
END
GO

-- Create MenuItems table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'menu_items')
BEGIN
    CREATE TABLE menu_items (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        menu_id BIGINT NOT NULL,
        parent_id BIGINT,
        label NVARCHAR(100) NOT NULL,
        url NVARCHAR(500),
        order_num INT DEFAULT 0,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES menu_items(id)
    );

    CREATE INDEX idx_menu_items_menu ON menu_items(menu_id);
    CREATE INDEX idx_menu_items_parent ON menu_items(parent_id);
END
GO

-- Create Forms table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'forms')
BEGIN
    CREATE TABLE forms (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(500),
        fields_json NVARCHAR(MAX) NOT NULL,
        is_active BIT DEFAULT 1,
        user_id BIGINT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX idx_forms_user ON forms(user_id);
END
GO

-- Create Submissions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'submissions')
BEGIN
    CREATE TABLE submissions (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        form_id BIGINT NOT NULL,
        data_json NVARCHAR(MAX) NOT NULL,
        ip_address NVARCHAR(50),
        user_agent NVARCHAR(500),
        submitted_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_submissions_form ON submissions(form_id);
    CREATE INDEX idx_submissions_date ON submissions(submitted_at);
END
GO

-- Create Settings table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'settings')
BEGIN
    CREATE TABLE settings (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        [key] NVARCHAR(100) NOT NULL UNIQUE,
        value NVARCHAR(MAX),
        description NVARCHAR(500),
        updated_at DATETIME DEFAULT GETDATE()
    );

    CREATE INDEX idx_settings_key ON settings([key]);

    -- Insert default settings
    INSERT INTO settings ([key], value, description) VALUES
    ('site_name', 'NovaLanding CMS', 'Website name'),
    ('site_description', 'Professional Landing Page Builder', 'Website description'),
    ('smtp_host', '', 'SMTP server host'),
    ('smtp_port', '587', 'SMTP server port'),
    ('smtp_username', '', 'SMTP username'),
    ('smtp_password', '', 'SMTP password'),
    ('smtp_from_email', '', 'From email address'),
    ('smtp_from_name', 'NovaLanding', 'From name'),
    ('telegram_enabled', 'true', 'Enable Telegram notifications'),
    ('seo_default_title', 'NovaLanding CMS', 'Default SEO title'),
    ('seo_default_description', 'Create amazing landing pages', 'Default SEO description'),
    ('social_facebook', '', 'Facebook URL'),
    ('social_twitter', '', 'Twitter URL'),
    ('social_linkedin', '', 'LinkedIn URL'),
    ('social_instagram', '', 'Instagram URL');
END
GO

-- Create ActivityLogs table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'activity_logs')
BEGIN
    CREATE TABLE activity_logs (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        user_id BIGINT,
        action NVARCHAR(100) NOT NULL,
        entity_type NVARCHAR(50),
        entity_id BIGINT,
        details NVARCHAR(MAX),
        ip_address NVARCHAR(50),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
    CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);
    CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
END
GO

-- Create trigger for posts updated_at
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_posts_updated_at')
BEGIN
    EXEC('
    CREATE TRIGGER trg_posts_updated_at
    ON posts
    AFTER UPDATE
    AS
    BEGIN
        UPDATE posts
        SET updated_at = GETDATE()
        FROM posts p
        INNER JOIN inserted i ON p.id = i.id
    END
    ');
END
GO

-- Create trigger for menus updated_at
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_menus_updated_at')
BEGIN
    EXEC('
    CREATE TRIGGER trg_menus_updated_at
    ON menus
    AFTER UPDATE
    AS
    BEGIN
        UPDATE menus
        SET updated_at = GETDATE()
        FROM menus m
        INNER JOIN inserted i ON m.id = i.id
    END
    ');
END
GO

-- Create trigger for forms updated_at
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_forms_updated_at')
BEGIN
    EXEC('
    CREATE TRIGGER trg_forms_updated_at
    ON forms
    AFTER UPDATE
    AS
    BEGIN
        UPDATE forms
        SET updated_at = GETDATE()
        FROM forms f
        INNER JOIN inserted i ON f.id = i.id
    END
    ');
END
GO

PRINT 'Database migration completed successfully!';
GO
