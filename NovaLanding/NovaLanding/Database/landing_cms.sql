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

-- Create leads table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'leads')
BEGIN
    CREATE TABLE leads (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        page_id BIGINT NOT NULL,
        form_data NVARCHAR(MAX) NOT NULL,
        submitted_at DATETIME DEFAULT GETDATE(),
        ip_address NVARCHAR(50),
        CONSTRAINT FK_leads_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_leads_page_id ON leads(page_id);
    CREATE INDEX idx_leads_submitted_at ON leads(submitted_at);
END
GO

-- Create page_views table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'page_views')
BEGIN
    CREATE TABLE page_views (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        page_id BIGINT NOT NULL,
        viewed_at DATETIME DEFAULT GETDATE(),
        ip_address NVARCHAR(50),
        user_agent NVARCHAR(500),
        CONSTRAINT FK_page_views_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_page_views_page_id ON page_views(page_id);
    CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
END
GO

PRINT 'Leads and PageViews tables created successfully!';

INSERT INTO blocks_templates (name, type, default_html, description, is_active, created_at)
VALUES (
    'Contact Form - Lead Collection',
    'form',
    '<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body p-4">
                    <h3 class="text-center mb-4">Get In Touch</h3>
                    <form id="contactForm" class="lead-form">
                        <div class="mb-3">
                            <label for="name" class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address *</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" class="form-control" id="phone" name="phone">
                        </div>
                        <div class="mb-3">
                            <label for="message" class="form-label">Message</label>
                            <textarea class="form-control" id="message" name="message" rows="4"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="/js/lead-form.js"></script>',
    'Contact form with lead collection and Telegram notification',
    1,
    GETDATE()
);

INSERT INTO blocks_templates (name, type, default_html, description, is_active, created_at)
VALUES (
    'Newsletter Signup Form',
    'form',
    '<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-8 text-center">
            <h2 class="mb-3">Subscribe to Our Newsletter</h2>
            <p class="text-muted mb-4">Get the latest updates and offers delivered to your inbox</p>
            <form id="newsletterForm" class="lead-form">
                <div class="row g-2">
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-5">
                        <input type="email" class="form-control" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100">Subscribe</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="/js/lead-form.js"></script>',
    'Simple newsletter signup form with lead collection',
    1,
    GETDATE()
);

PRINT 'Sample form templates created successfully!';

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'activity_logs')
BEGIN
    CREATE TABLE activity_logs (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NULL,
        action NVARCHAR(100) NOT NULL,
        entity_type NVARCHAR(50) NULL,
        entity_id BIGINT NULL,
        details NVARCHAR(MAX) NULL,
        ip_address NVARCHAR(50) NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_activity_logs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
    CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE UNIQUE INDEX UQ_categories_slug ON categories(slug);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'forms')
BEGIN
    CREATE TABLE forms (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NULL,
        fields_json NVARCHAR(MAX) NOT NULL,
        is_active BIT NOT NULL DEFAULT 1,
        user_id BIGINT NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_forms_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_forms_user_id ON forms(user_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'menus')
BEGIN
    CREATE TABLE menus (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        location NVARCHAR(50) NOT NULL,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'menu_items')
BEGIN
    CREATE TABLE menu_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        menu_id BIGINT NOT NULL,
        parent_id BIGINT NULL,
        label NVARCHAR(100) NOT NULL,
        url NVARCHAR(500) NULL,
        order_num INT NOT NULL DEFAULT 0,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_menu_items_menu_id FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
        CONSTRAINT FK_menu_items_parent_id FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_menu_items_menu_order ON menu_items(menu_id, order_num);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'posts')
BEGIN
    CREATE TABLE posts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(200) NOT NULL,
        slug NVARCHAR(100) NOT NULL,
        content NVARCHAR(MAX) NULL,
        excerpt NVARCHAR(MAX) NULL,
        thumbnail_id BIGINT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
        user_id BIGINT NOT NULL,
        published_at DATETIME2 NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_posts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_posts_thumbnail_id FOREIGN KEY (thumbnail_id) REFERENCES media(id) ON DELETE SET NULL
    );
    CREATE UNIQUE INDEX UQ_posts_slug ON posts(slug);
    CREATE INDEX idx_posts_status_slug ON posts(status, slug);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'post_categories')
BEGIN
    CREATE TABLE post_categories (
        post_id BIGINT NOT NULL,
        category_id BIGINT NOT NULL,
        CONSTRAINT PK_post_categories PRIMARY KEY (post_id, category_id),
        CONSTRAINT FK_post_categories_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        CONSTRAINT FK_post_categories_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tags')
BEGIN
    CREATE TABLE tags (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE UNIQUE INDEX UQ_tags_slug ON tags(slug);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'post_tags')
BEGIN
    CREATE TABLE post_tags (
        post_id BIGINT NOT NULL,
        tag_id BIGINT NOT NULL,
        CONSTRAINT PK_post_tags PRIMARY KEY (post_id, tag_id),
        CONSTRAINT FK_post_tags_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        CONSTRAINT FK_post_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'refresh_tokens')
BEGIN
    CREATE TABLE refresh_tokens (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        token NVARCHAR(255) NOT NULL,
        expires_at DATETIME2 NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        is_revoked BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_refresh_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX UQ_refresh_tokens_token ON refresh_tokens(token);
    CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'roles')
BEGIN
    CREATE TABLE roles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL,
        description NVARCHAR(MAX) NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE UNIQUE INDEX UQ_roles_name ON roles(name);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'settings')
BEGIN
    CREATE TABLE settings (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        [key] NVARCHAR(100) NOT NULL,
        value NVARCHAR(MAX) NULL,
        description NVARCHAR(MAX) NULL,
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE UNIQUE INDEX UQ_settings_key ON settings([key]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'submissions')
BEGIN
    CREATE TABLE submissions (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        form_id BIGINT NOT NULL,
        data_json NVARCHAR(MAX) NOT NULL,
        ip_address NVARCHAR(50) NULL,
        user_agent NVARCHAR(500) NULL,
        submitted_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_submissions_form_id FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_submissions_form_id ON submissions(form_id);
    CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
END
GO

