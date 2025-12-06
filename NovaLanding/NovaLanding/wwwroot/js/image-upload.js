// NovaLanding CMS - Image Upload & Media Picker JavaScript

class ImageUploader {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
        this.allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.uploadEndpoint = options.uploadEndpoint || '/api/media/upload';
    }
    
    async upload(file, onProgress) {
        // Validate file
        if (!this.validateFile(file)) {
            return null;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable && onProgress) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        reject(new Error('Upload failed'));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed'));
                });
                
                const token = localStorage.getItem('token');
                xhr.open('POST', this.uploadEndpoint);
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                xhr.send(formData);
            });
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
    
    validateFile(file) {
        if (!file) {
            Toast.error('No file selected');
            return false;
        }
        
        if (!this.allowedTypes.includes(file.type)) {
            Toast.error('Invalid file type. Please upload an image.');
            return false;
        }
        
        if (file.size > this.maxSize) {
            Toast.error(`File size exceeds ${Utils.formatFileSize(this.maxSize)}`);
            return false;
        }
        
        return true;
    }
    
    createPreview(file, container) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'relative inline-block mr-2 mb-2';
            preview.innerHTML = `
                <img src="${e.target.result}" class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300" />
                <button onclick="this.parentElement.remove()" 
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                    <i class="fas fa-times text-xs"></i>
                </button>
            `;
            
            if (typeof container === 'string') {
                document.getElementById(container).appendChild(preview);
            } else {
                container.appendChild(preview);
            }
        };
        
        reader.readAsDataURL(file);
    }
}

// Media Picker Modal
class MediaPicker {
    constructor() {
        this.selectedImages = [];
        this.multiSelect = false;
        this.onSelect = null;
    }
    
    async show(options = {}) {
        this.multiSelect = options.multiSelect || false;
        this.onSelect = options.onSelect;
        this.selectedImages = [];
        
        const body = `
            <div class="space-y-4">
                <!-- Upload Tab -->
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-4">
                        <button onclick="mediaPicker.switchTab('upload')" 
                                class="tab-btn px-4 py-2 border-b-2 border-primary text-primary font-medium">
                            Upload New
                        </button>
                        <button onclick="mediaPicker.switchTab('library')" 
                                class="tab-btn px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                            Media Library
                        </button>
                    </nav>
                </div>
                
                <!-- Upload Tab Content -->
                <div id="upload-tab" class="tab-content">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input type="file" 
                               id="media-file-input" 
                               accept="image/*" 
                               ${this.multiSelect ? 'multiple' : ''}
                               class="hidden" 
                               onchange="mediaPicker.handleFileSelect(event)" />
                        <label for="media-file-input" class="cursor-pointer">
                            <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600 mb-2">Click to upload or drag and drop</p>
                            <p class="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </label>
                    </div>
                    <div id="upload-preview" class="mt-4 grid grid-cols-4 gap-4"></div>
                    <div id="upload-progress" class="hidden mt-4">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div id="progress-bar" class="bg-primary h-2 rounded-full transition-all" style="width: 0%"></div>
                        </div>
                        <p class="text-sm text-gray-600 mt-2 text-center">Uploading...</p>
                    </div>
                </div>
                
                <!-- Library Tab Content -->
                <div id="library-tab" class="tab-content hidden">
                    <div class="mb-4">
                        <input type="text" 
                               id="media-search" 
                               placeholder="Search media..." 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                               oninput="mediaPicker.searchMedia(this.value)" />
                    </div>
                    <div id="media-grid" class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                        <div class="col-span-4 text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Loading media...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const footer = `
            <button type="button" 
                    onclick="Modal.close()" 
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
            </button>
            <button type="button" 
                    onclick="mediaPicker.confirmSelection()" 
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                <i class="fas fa-check mr-2"></i> Select
            </button>
        `;
        
        Modal.show({
            title: 'Media Picker',
            body: body,
            footer: footer,
            size: 'max-w-4xl'
        });
        
        this.loadMediaLibrary();
    }
    
    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-primary', 'text-primary');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        event.target.classList.add('border-primary', 'text-primary');
        event.target.classList.remove('border-transparent', 'text-gray-500');
        
        document.getElementById(`${tab}-tab`).classList.remove('hidden');
        
        if (tab === 'library') {
            this.loadMediaLibrary();
        }
    }
    
    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        const uploader = new ImageUploader();
        const progressDiv = document.getElementById('upload-progress');
        const progressBar = document.getElementById('progress-bar');
        
        progressDiv.classList.remove('hidden');
        
        for (const file of files) {
            try {
                const result = await uploader.upload(file, (percent) => {
                    progressBar.style.width = percent + '%';
                });
                
                if (result && result.url) {
                    this.selectedImages.push(result.url);
                    this.renderUploadPreview(result.url);
                }
            } catch (error) {
                Toast.error(`Failed to upload ${file.name}`);
            }
        }
        
        progressDiv.classList.add('hidden');
        progressBar.style.width = '0%';
        Toast.success('Upload complete!');
    }
    
    renderUploadPreview(url) {
        const preview = document.getElementById('upload-preview');
        const div = document.createElement('div');
        div.className = 'relative group';
        div.innerHTML = `
            <img src="${url}" class="w-full h-32 object-cover rounded-lg border-2 border-primary" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <i class="fas fa-check-circle text-white text-2xl"></i>
            </div>
        `;
        preview.appendChild(div);
    }
    
    async loadMediaLibrary() {
        const grid = document.getElementById('media-grid');
        
        try {
            const response = await API.get('/media');
            const media = response.data || response;
            
            if (!media || media.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-4 text-center py-8 text-gray-500">
                        <i class="fas fa-images text-4xl mb-2"></i>
                        <p>No media files found</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = media.map(item => `
                <div class="media-item relative group cursor-pointer" 
                     onclick="mediaPicker.toggleSelection('${item.url}', this)">
                    <img src="${item.url}" 
                         class="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary transition-colors" />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <i class="fas fa-check-circle text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                    <div class="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i class="fas fa-check text-primary text-sm hidden selected-icon"></i>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            grid.innerHTML = `
                <div class="col-span-4 text-center py-8 text-red-500">
                    <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
                    <p>Failed to load media</p>
                </div>
            `;
        }
    }
    
    toggleSelection(url, element) {
        const img = element.querySelector('img');
        const icon = element.querySelector('.selected-icon');
        
        if (this.multiSelect) {
            const index = this.selectedImages.indexOf(url);
            if (index > -1) {
                this.selectedImages.splice(index, 1);
                img.classList.remove('border-primary');
                img.classList.add('border-gray-200');
                icon.classList.add('hidden');
            } else {
                this.selectedImages.push(url);
                img.classList.add('border-primary');
                img.classList.remove('border-gray-200');
                icon.classList.remove('hidden');
            }
        } else {
            // Single select - clear previous selection
            document.querySelectorAll('.media-item img').forEach(i => {
                i.classList.remove('border-primary');
                i.classList.add('border-gray-200');
            });
            document.querySelectorAll('.selected-icon').forEach(i => {
                i.classList.add('hidden');
            });
            
            this.selectedImages = [url];
            img.classList.add('border-primary');
            img.classList.remove('border-gray-200');
            icon.classList.remove('hidden');
        }
    }
    
    confirmSelection() {
        if (this.selectedImages.length === 0) {
            Toast.warning('Please select at least one image');
            return;
        }
        
        if (this.onSelect) {
            this.onSelect(this.multiSelect ? this.selectedImages : this.selectedImages[0]);
        }
        
        Modal.close();
    }
    
    searchMedia(query) {
        const items = document.querySelectorAll('.media-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            const url = img.src.toLowerCase();
            item.style.display = url.includes(query.toLowerCase()) ? '' : 'none';
        });
    }
}

// Global instances
const imageUploader = new ImageUploader();
const mediaPicker = new MediaPicker();

// Helper function to open media picker
function openMediaPicker(sectionIndex, field, multiSelect = false) {
    mediaPicker.show({
        multiSelect: multiSelect,
        onSelect: (urls) => {
            if (field === 'gallery') {
                if (Array.isArray(urls)) {
                    urls.forEach(url => sectionBuilder.addGalleryImage(sectionIndex, url));
                } else {
                    sectionBuilder.addGalleryImage(sectionIndex, urls);
                }
            } else {
                const input = document.getElementById(`hero-image-${sectionIndex}`);
                if (input) {
                    input.value = urls;
                    sectionBuilder.updateSection(sectionIndex, field, urls);
                    sectionBuilder.render();
                }
            }
            Toast.success('Image selected');
        }
    });
}

// Export
window.ImageUploader = ImageUploader;
window.MediaPicker = MediaPicker;
window.imageUploader = imageUploader;
window.mediaPicker = mediaPicker;
window.openMediaPicker = openMediaPicker;
