// NovaLanding CMS - Admin Dashboard JavaScript

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/login';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
}

// Auto-generate slug from title
function setupSlugGenerator(titleInputId, slugInputId) {
    const titleInput = document.getElementById(titleInputId);
    const slugInput = document.getElementById(slugInputId);
    
    if (titleInput && slugInput) {
        titleInput.addEventListener('input', Utils.debounce(function() {
            if (!slugInput.dataset.manuallyEdited) {
                slugInput.value = Utils.generateSlug(this.value);
            }
        }, 300));
        
        slugInput.addEventListener('input', function() {
            this.dataset.manuallyEdited = 'true';
        });
    }
}

// Table search functionality
function setupTableSearch(searchInputId, tableId) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    
    if (searchInput && table) {
        searchInput.addEventListener('input', Utils.debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300));
    }
}

// Pagination helper
class Pagination {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 1;
        this.onPageChange = options.onPageChange || (() => {});
    }
    
    render() {
        if (!this.container || this.totalPages <= 1) return;
        
        let html = '<div class="flex items-center justify-center space-x-2">';
        
        // Previous button
        html += `
            <button onclick="pagination.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                html += `
                    <button onclick="pagination.goToPage(${i})" 
                            class="px-4 py-2 border rounded-lg ${i === this.currentPage ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += '<span class="px-2">...</span>';
            }
        }
        
        // Next button
        html += `
            <button onclick="pagination.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === this.totalPages ? 'disabled' : ''}
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        html += '</div>';
        this.container.innerHTML = html;
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.onPageChange(page);
        this.render();
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Status badge helper
function getStatusBadge(status) {
    const badges = {
        active: '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>',
        inactive: '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>',
        draft: '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>',
        published: '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Published</span>',
        pending: '<span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Pending</span>'
    };
    
    return badges[status.toLowerCase()] || status;
}

// Role badge helper
function getRoleBadge(role) {
    const badges = {
        admin: '<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"><i class="fas fa-crown mr-1"></i>Admin</span>',
        editor: '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"><i class="fas fa-edit mr-1"></i>Editor</span>',
        user: '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"><i class="fas fa-user mr-1"></i>User</span>'
    };
    
    return badges[role.toLowerCase()] || role;
}

// Initialize tooltips (if using a tooltip library)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const text = this.dataset.tooltip;
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-900 text-white text-xs rounded py-1 px-2 z-50';
            tooltip.textContent = text;
            tooltip.id = 'active-tooltip';
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            
            document.body.appendChild(tooltip);
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('active-tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Export functions
window.checkAuth = checkAuth;
window.logout = logout;
window.setupSlugGenerator = setupSlugGenerator;
window.setupTableSearch = setupTableSearch;
window.Pagination = Pagination;
window.validateForm = validateForm;
window.getStatusBadge = getStatusBadge;
window.getRoleBadge = getRoleBadge;
window.initTooltips = initTooltips;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check auth on admin pages
    if (window.location.pathname.includes('/admin') || 
        window.location.pathname.includes('/dashboard') ||
        window.location.pathname.includes('/pages') ||
        window.location.pathname.includes('/media')) {
        checkAuth();
    }
    
    // Initialize tooltips
    initTooltips();
});
