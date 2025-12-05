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
