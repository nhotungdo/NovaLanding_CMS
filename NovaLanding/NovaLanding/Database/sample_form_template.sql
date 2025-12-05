-- Sample Form Template for Lead Collection
-- Insert this template into blocks_templates table

INSERT INTO blocks_templates (name, type, default_html, description, is_active, created_at)
VALUES (
    'Contact Form - Lead Collection',
    'Form',
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

-- Sample Newsletter Signup Form
INSERT INTO blocks_templates (name, type, default_html, description, is_active, created_at)
VALUES (
    'Newsletter Signup Form',
    'Form',
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
