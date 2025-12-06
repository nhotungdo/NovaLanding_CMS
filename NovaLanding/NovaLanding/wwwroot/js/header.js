// NovaLanding - Unified Header JavaScript
// Handles all header interactions, dropdowns, and functionality

(function() {
    'use strict';
    
    // Initialize header on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        initializeHeader();
        setupKeyboardShortcuts();
        setupSearchFunctionality();
        setupActiveNavigation();
        setupBreadcrumb();
    });
    
    // Initialize header components
    function initializeHeader() {
        loadUserInfo();
        loadNotifications();
        loadLanguagePreference();
        setupDropdownHandlers();
    }
    
    // Load user information
    function loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (user.username) {
            // Set header user info
            const headerUserName = document.getElementById('headerUserName');
            const headerUserRole = document.getElementById('headerUserRole');
            const headerUserInitials = document.getElementById('headerUserInitials');
            
            if (headerUserName) headerUserName.textContent = user.username;
            if (headerUserRole) headerUserRole.textContent = user.role || 'User';
            if (headerUserInitials) headerUserInitials.textContent = user.username.charAt(0).toUpperCase();
            
            // Set dropdown user info
            const dropdownUserName = document.getElementById('dropdownUserName');
            const dropdownUserEmail = document.getElementById('dropdownUserEmail');
            
            if (dropdownUserName) dropdownUserName.textContent = user.username;
            if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'user@example.com';
        }
    }
    
    // Load notifications
    function loadNotifications() {
        // Simulate loading notifications
        // In production, this would fetch from an API
        const hasNotifications = false;
        const badge = document.getElementById('notificationBadge');
        
        if (badge) {
            badge.style.display = hasNotifications ? 'block' : 'none';
        }
    }
    
    // Load language preference
    function loadLanguagePreference() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        const currentLanguage = document.getElementById('currentLanguage');
        
        if (currentLanguage) {
            currentLanguage.textContent = savedLanguage.toUpperCase();
        }
        
        // Update active language in dropdown
        updateActiveLanguage(savedLanguage);
    }
    
    // Setup dropdown handlers
    function setupDropdownHandlers() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            const isDropdownClick = event.target.closest('.user-menu, .action-btn, .language-selector');
            
            if (!isDropdownClick) {
                dropdowns.forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
        
        // Close dropdowns on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const dropdowns = document.querySelectorAll('.dropdown-menu');
                dropdowns.forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    // Toggle user menu
    window.toggleUserMenu = function() {
        const dropdown = document.getElementById('userDropdown');
        const isVisible = dropdown.style.display === 'block';
        
        // Close all other dropdowns
        closeAllDropdowns();
        
        // Toggle this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';
    };
    
    // Toggle create menu
    window.showCreateMenu = function() {
        const dropdown = document.getElementById('createMenu');
        const isVisible = dropdown.style.display === 'block';
        
        // Close all other dropdowns
        closeAllDropdowns();
        
        // Toggle this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';
    };
    
    // Toggle notifications
    window.toggleNotifications = function() {
        const dropdown = document.getElementById('notificationsMenu');
        const isVisible = dropdown.style.display === 'block';
        
        // Close all other dropdowns
        closeAllDropdowns();
        
        // Toggle this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';
        
        // Mark notifications as read
        if (!isVisible) {
            setTimeout(() => {
                const badge = document.getElementById('notificationBadge');
                if (badge) badge.style.display = 'none';
            }, 1000);
        }
    };
    
    // Toggle help
    window.toggleHelp = function() {
        // Open help documentation or modal
        window.open('/help', '_blank');
    };
    
    // Toggle language menu
    window.toggleLanguageMenu = function() {
        const dropdown = document.getElementById('languageMenu');
        const isVisible = dropdown.style.display === 'block';
        
        // Close all other dropdowns
        closeAllDropdowns();
        
        // Toggle this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';
    };
    
    // Close all dropdowns
    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
    
    // Change language
    window.changeLanguage = function(lang) {
        localStorage.setItem('language', lang);
        
        const currentLanguage = document.getElementById('currentLanguage');
        if (currentLanguage) {
            currentLanguage.textContent = lang.toUpperCase();
        }
        
        updateActiveLanguage(lang);
        closeAllDropdowns();
        
        // Show success message
        showToast('Language changed to ' + lang.toUpperCase(), 'success');
        
        // In production, reload page or update content
        // location.reload();
    };
    
    // Update active language indicator
    function updateActiveLanguage(lang) {
        const languageItems = document.querySelectorAll('#languageMenu .dropdown-item');
        languageItems.forEach(item => {
            const checkIcon = item.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'none';
            }
        });
        
        // Show check icon for active language
        const activeItem = Array.from(languageItems).find(item => 
            item.getAttribute('onclick')?.includes(`'${lang}'`)
        );
        
        if (activeItem) {
            const checkIcon = activeItem.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'block';
            }
        }
    }
    
    // Toggle theme
    window.toggleTheme = function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = newTheme === 'dark';
        }
        
        showToast(`Switched to ${newTheme} mode`, 'success');
    };
    
    // Mark all notifications as read
    window.markAllAsRead = function() {
        const badge = document.getElementById('notificationBadge');
        if (badge) badge.style.display = 'none';
        
        showToast('All notifications marked as read', 'success');
    };
    
    // Logout function
    window.logout = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/Auth/Login';
        }
    };
    
    // Setup keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(event) {
            // Command/Ctrl + K for search
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Command/Ctrl + P for profile
            if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
                event.preventDefault();
                window.location.href = '/profile';
            }
            
            // Command/Ctrl + , for settings
            if ((event.metaKey || event.ctrlKey) && event.key === ',') {
                event.preventDefault();
                window.location.href = '/admin/settings';
            }
        });
    }
    
    // Setup search functionality
    function setupSearchFunctionality() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim();
            
            if (query.length < 2) return;
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Handle search on enter
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // Perform search
    function performSearch(query) {
        console.log('Searching for:', query);
        
        // In production, this would call an API
        // fetch(`/api/search?q=${encodeURIComponent(query)}`)
        //     .then(response => response.json())
        //     .then(results => displaySearchResults(results));
    }
    
    // Setup active navigation highlighting
    function setupActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            const page = link.getAttribute('data-page');
            
            if (currentPath.startsWith(linkPath) || currentPath.includes(page)) {
                link.classList.add('active');
            }
        });
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-in-out;
            font-size: 14px;
            font-weight: 500;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Setup breadcrumb navigation
    function setupBreadcrumb() {
        const breadcrumbContainer = document.getElementById('headerBreadcrumb');
        if (!breadcrumbContainer) return;
        
        const currentPath = window.location.pathname;
        const breadcrumbs = generateBreadcrumbs(currentPath);
        
        if (breadcrumbs.length > 0) {
            breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return `
                    <span class="breadcrumb-separator">/</span>
                    ${isLast 
                        ? `<span class="breadcrumb-current">${crumb.label}</span>`
                        : `<a href="${crumb.url}" class="breadcrumb-link">${crumb.label}</a>`
                    }
                `;
            }).join('');
        }
    }
    
    // Generate breadcrumbs from current path
    function generateBreadcrumbs(path) {
        const breadcrumbs = [];
        const segments = path.split('/').filter(s => s);
        
        // Map of path segments to readable labels
        const labelMap = {
            'dashboard': 'Dashboard',
            'pages': 'Pages',
            'builder': 'Page Builder',
            'media': 'Media Library',
            'leads': 'Leads',
            'admin': 'Admin',
            'settings': 'Settings',
            'templates': 'Templates',
            'users': 'Users',
            'auth': 'Authentication',
            'profile': 'Profile'
        };
        
        let currentUrl = '';
        segments.forEach((segment, index) => {
            currentUrl += '/' + segment;
            const label = labelMap[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1);
            
            // Skip auth pages in breadcrumb
            if (segment.toLowerCase() !== 'auth') {
                breadcrumbs.push({
                    label: label,
                    url: currentUrl
                });
            }
        });
        
        return breadcrumbs;
    }
    
    // Update breadcrumb dynamically (can be called from other pages)
    window.updateBreadcrumb = function(breadcrumbs) {
        const breadcrumbContainer = document.getElementById('headerBreadcrumb');
        if (!breadcrumbContainer) return;
        
        breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-separator">/</span>
                ${isLast 
                    ? `<span class="breadcrumb-current">${crumb.label}</span>`
                    : `<a href="${crumb.url}" class="breadcrumb-link">${crumb.label}</a>`
                }
            `;
        }).join('');
    };
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
})();
