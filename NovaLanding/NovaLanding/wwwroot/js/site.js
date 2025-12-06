// NovaLanding CMS - Core JavaScript Functions

// Toast Notification System
const Toast = {
    show: function(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast-item flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        
        const icons = {
            success: { class: 'text-green-500 bg-green-100', icon: 'fa-check-circle' },
            error: { class: 'text-red-500 bg-red-100', icon: 'fa-exclamation-circle' },
            warning: { class: 'text-yellow-500 bg-yellow-100', icon: 'fa-exclamation-triangle' },
            info: { class: 'text-blue-500 bg-blue-100', icon: 'fa-info-circle' }
        };
        
        const iconConfig = icons[type] || icons.info;
        
        toast.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconConfig.class} rounded-lg">
                <i class="fas ${iconConfig.icon}"></i>
            </div>
            <div class="ml-3 text-sm font-normal">${message}</div>
            <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.remove('translate-x-full'), 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    },
    
    success: function(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Modal System
const Modal = {
    show: function(options) {
        const { title, body, footer, size = 'max-w-2xl', onClose } = options;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.id = 'active-modal';
        
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-lg shadow-xl ${size} w-full max-h-[90vh] overflow-hidden transform transition-all">
                <div class="modal-header flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="modal-title text-xl font-semibold text-gray-900">${title}</h3>
                    <button type="button" class="modal-close text-gray-400 hover:text-gray-900 rounded-lg text-sm p-1.5">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="modal-body p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    ${body}
                </div>
                ${footer ? `<div class="modal-footer flex items-center justify-end space-x-2 p-4 border-t border-gray-200">${footer}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.close();
            if (onClose) onClose();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
                if (onClose) onClose();
            }
        });
        
        return modal;
    },
    
    close: function() {
        const modal = document.getElementById('active-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    confirm: function(message, onConfirm, onCancel) {
        const footer = `
            <button type="button" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" onclick="Modal.close(); ${onCancel ? 'onCancel()' : ''}">
                Cancel
            </button>
            <button type="button" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onclick="Modal.close(); (${onConfirm})()">
                Confirm
            </button>
        `;
        
        this.show({
            title: 'Confirm Action',
            body: `<p class="text-gray-700">${message}</p>`,
            footer: footer,
            size: 'max-w-md'
        });
    }
};

// Loading Overlay
const Loading = {
    show: function() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                    <p class="text-gray-700 font-medium">Loading...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.classList.remove('hidden');
    },
    
    hide: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
};

// API Helper
const API = {
    baseUrl: '/api',
    
    getToken: function() {
        return localStorage.getItem('token');
    },
    
    getHeaders: function(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    },
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false)
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    get: function(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },
    
    post: function(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    put: function(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    delete: function(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

// Utility Functions
const Utils = {
    // Generate slug from text
    generateSlug: function(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    // Format date
    formatDate: function(date, format = 'short') {
        const d = new Date(date);
        if (format === 'short') {
            return d.toLocaleDateString();
        } else if (format === 'long') {
            return d.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } else if (format === 'time') {
            return d.toLocaleString();
        }
        return d.toISOString();
    },
    
    // Copy to clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            Toast.success('Copied to clipboard!');
        }).catch(() => {
            Toast.error('Failed to copy');
        });
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Validate email
    isValidEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Confirm delete helper
function confirmDelete(message, onConfirm) {
    if (confirm(message || 'Are you sure you want to delete this item?')) {
        onConfirm();
    }
}

// Export for use in other scripts
window.Toast = Toast;
window.Modal = Modal;
window.Loading = Loading;
window.API = API;
window.Utils = Utils;
