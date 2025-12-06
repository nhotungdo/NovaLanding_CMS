// NovaLanding Dashboard - Modern Minimalist Interface

// Authentication Check
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/Auth/Login';
}

// Show admin-only elements
if (user.role === 'admin') {
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.style.display = 'inline-flex';
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load metrics
        await Promise.all([
            loadPagesCount(),
            loadSectionsCount(),
            loadMediaCount(),
            loadUsersCount(),
            loadRecentPages()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

// Load Pages Count
async function loadPagesCount() {
    try {
        const response = await fetch('/api/dashboard/pages-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            animateCounter('pagesCount', data.count || 0);
        }
    } catch (error) {
        console.error('Error loading pages count:', error);
    }
}

// Load Sections Count
async function loadSectionsCount() {
    try {
        const response = await fetch('/api/dashboard/sections-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            animateCounter('sectionsCount', data.count || 0);
        }
    } catch (error) {
        console.error('Error loading sections count:', error);
    }
}

// Load Media Count
async function loadMediaCount() {
    try {
        const response = await fetch('/api/media', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            animateCounter('imagesCount', data.length || 0);
        }
    } catch (error) {
        console.error('Error loading media count:', error);
    }
}

// Load Users Count
async function loadUsersCount() {
    try {
        if (user.role !== 'admin') {
            document.getElementById('usersCount').textContent = '-';
            return;
        }
        
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            animateCounter('usersCount', data.length || 0);
        }
    } catch (error) {
        console.error('Error loading users count:', error);
    }
}

// Load Recent Pages
async function loadRecentPages() {
    try {
        const response = await fetch('/api/pages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load pages');
        
        const pages = await response.json();
        const recentPages = pages.slice(0, 5); // Get 5 most recent
        
        const tableBody = document.getElementById('recentPagesTable');
        
        if (recentPages.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.5;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <div>No pages yet. Create your first page to get started!</div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = recentPages.map(page => `
            <tr>
                <td>
                    <div style="font-weight: 500; color: var(--color-text-primary);">${escapeHtml(page.title)}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px;">
                        /${escapeHtml(page.slug)}
                    </div>
                </td>
                <td>
                    <span class="badge ${getStatusBadgeClass(page.status)}">
                        ${page.status || 'Draft'}
                    </span>
                </td>
                <td style="color: var(--color-text-secondary);">
                    ${formatDate(page.updatedAt || page.createdAt)}
                </td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
                        <button class="btn btn-sm btn-secondary" onclick="editPage(${page.id})" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="viewPage('${escapeHtml(page.slug)}')" title="View">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent pages:', error);
    }
}

// Helper Functions
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

function getStatusBadgeClass(status) {
    const statusMap = {
        'published': 'badge-success',
        'draft': 'badge-gray',
        'archived': 'badge-warning'
    };
    return statusMap[status?.toLowerCase()] || 'badge-gray';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function editPage(pageId) {
    window.location.href = `/Pages/Builder?id=${pageId}`;
}

function viewPage(slug) {
    window.open(`/view/${slug}`, '_blank');
}

function sortTable(column) {
    // Implement sorting logic here
    console.log('Sorting by:', column);
}

function showToast(message, type = 'info') {
    // Implement toast notification
    console.log(`[${type}] ${message}`);
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});
