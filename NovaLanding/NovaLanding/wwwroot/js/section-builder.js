// NovaLanding CMS - Section Builder JavaScript

class SectionBuilder {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.sections = [];
        this.sectionTypes = {
            hero: {
                name: 'Hero',
                icon: 'fa-star',
                template: this.getHeroTemplate
            },
            text: {
                name: 'Text',
                icon: 'fa-align-left',
                template: this.getTextTemplate
            },
            gallery: {
                name: 'Gallery',
                icon: 'fa-images',
                template: this.getGalleryTemplate
            },
            testimonials: {
                name: 'Testimonials',
                icon: 'fa-quote-left',
                template: this.getTestimonialsTemplate
            },
            cta: {
                name: 'Call to Action',
                icon: 'fa-bullhorn',
                template: this.getCtaTemplate
            },
            features: {
                name: 'Features',
                icon: 'fa-th-large',
                template: this.getFeaturesTemplate
            }
        };
    }
    
    init(existingSections = []) {
        this.sections = existingSections;
        this.render();
        this.setupDragAndDrop();
    }
    
    render() {
        if (!this.container) return;
        
        let html = '<div class="space-y-4" id="sections-list">';
        
        this.sections.forEach((section, index) => {
            html += this.renderSection(section, index);
        });
        
        html += '</div>';
        html += this.renderAddButton();
        
        this.container.innerHTML = html;
        this.attachEventListeners();
    }
    
    renderSection(section, index) {
        const type = this.sectionTypes[section.type];
        const isVisible = section.isVisible !== false;
        
        return `
            <div class="section-card bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-primary transition-colors" 
                 data-section-id="${section.id || index}" 
                 data-section-index="${index}"
                 draggable="true">
                <!-- Section Header -->
                <div class="section-header flex items-center justify-between p-4 border-b border-gray-200 cursor-move">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-grip-vertical text-gray-400"></i>
                        <i class="fas ${type.icon} text-primary"></i>
                        <span class="font-semibold">${type.name}</span>
                        <span class="text-xs text-gray-500">#${index + 1}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <!-- Toggle Visibility -->
                        <button onclick="sectionBuilder.toggleVisibility(${index})" 
                                class="p-2 hover:bg-gray-100 rounded-lg" 
                                title="${isVisible ? 'Hide' : 'Show'} section">
                            <i class="fas ${isVisible ? 'fa-eye text-green-500' : 'fa-eye-slash text-gray-400'}"></i>
                        </button>
                        <!-- Collapse/Expand -->
                        <button onclick="sectionBuilder.toggleCollapse(${index})" 
                                class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-chevron-down section-toggle"></i>
                        </button>
                        <!-- Delete -->
                        <button onclick="sectionBuilder.deleteSection(${index})" 
                                class="p-2 hover:bg-red-100 text-red-500 rounded-lg">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Section Content -->
                <div class="section-content p-4 ${!isVisible ? 'opacity-50' : ''}">
                    ${type.template.call(this, section, index)}
                </div>
            </div>
        `;
    }
    
    renderAddButton() {
        return `
            <div class="mt-6">
                <button onclick="sectionBuilder.showAddSectionModal()" 
                        class="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-primary">
                    <i class="fas fa-plus-circle text-xl"></i>
                    <span class="font-medium">Add New Section</span>
                </button>
            </div>
        `;
    }
    
    getHeroTemplate(section, index) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" 
                           value="${section.content?.title || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'title', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter hero title">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input type="text" 
                           value="${section.content?.subtitle || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'subtitle', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter subtitle">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input type="text" 
                           value="${section.content?.buttonText || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'buttonText', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter button text">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input type="text" 
                           value="${section.content?.buttonLink || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'buttonLink', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter button link">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                    <div class="flex items-center space-x-2">
                        <input type="text" 
                               id="hero-image-${index}"
                               value="${section.content?.imageUrl || ''}" 
                               onchange="sectionBuilder.updateSection(${index}, 'imageUrl', this.value)"
                               class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                               placeholder="Image URL">
                        <button onclick="openMediaPicker(${index}, 'imageUrl')" 
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                            <i class="fas fa-image mr-2"></i> Browse
                        </button>
                    </div>
                    ${section.content?.imageUrl ? `<img src="${section.content.imageUrl}" class="mt-2 w-full h-32 object-cover rounded-lg" />` : ''}
                </div>
            </div>
        `;
    }
    
    getTextTemplate(section, index) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                    <input type="text" 
                           value="${section.content?.heading || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'heading', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter heading">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea rows="6" 
                              onchange="sectionBuilder.updateSection(${index}, 'content', this.value)"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter content">${section.content?.content || ''}</textarea>
                </div>
            </div>
        `;
    }
    
    getGalleryTemplate(section, index) {
        const images = section.content?.images || [];
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                    <div class="grid grid-cols-3 gap-4 mb-4" id="gallery-images-${index}">
                        ${images.map((img, imgIndex) => `
                            <div class="relative group">
                                <img src="${img}" class="w-full h-32 object-cover rounded-lg" />
                                <button onclick="sectionBuilder.removeGalleryImage(${index}, ${imgIndex})" 
                                        class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="openMediaPicker(${index}, 'gallery')" 
                            class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                        <i class="fas fa-plus mr-2"></i> Add Images
                    </button>
                </div>
            </div>
        `;
    }
    
    getTestimonialsTemplate(section, index) {
        const testimonials = section.content?.testimonials || [];
        return `
            <div class="space-y-4">
                <div id="testimonials-list-${index}">
                    ${testimonials.map((testimonial, tIndex) => `
                        <div class="border border-gray-200 rounded-lg p-4 mb-4">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-medium">Testimonial #${tIndex + 1}</span>
                                <button onclick="sectionBuilder.removeTestimonial(${index}, ${tIndex})" 
                                        class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <input type="text" 
                                   value="${testimonial.name || ''}" 
                                   onchange="sectionBuilder.updateTestimonial(${index}, ${tIndex}, 'name', this.value)"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                                   placeholder="Name">
                            <input type="text" 
                                   value="${testimonial.position || ''}" 
                                   onchange="sectionBuilder.updateTestimonial(${index}, ${tIndex}, 'position', this.value)"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                                   placeholder="Position">
                            <textarea rows="3" 
                                      onchange="sectionBuilder.updateTestimonial(${index}, ${tIndex}, 'text', this.value)"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="Testimonial text">${testimonial.text || ''}</textarea>
                        </div>
                    `).join('')}
                </div>
                <button onclick="sectionBuilder.addTestimonial(${index})" 
                        class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <i class="fas fa-plus mr-2"></i> Add Testimonial
                </button>
            </div>
        `;
    }
    
    getCtaTemplate(section, index) {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                    <input type="text" 
                           value="${section.content?.heading || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'heading', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter heading">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea rows="3" 
                              onchange="sectionBuilder.updateSection(${index}, 'description', this.value)"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter description">${section.content?.description || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input type="text" 
                           value="${section.content?.buttonText || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'buttonText', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter button text">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input type="text" 
                           value="${section.content?.buttonLink || ''}" 
                           onchange="sectionBuilder.updateSection(${index}, 'buttonLink', this.value)"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                           placeholder="Enter button link">
                </div>
            </div>
        `;
    }
    
    getFeaturesTemplate(section, index) {
        const features = section.content?.features || [];
        return `
            <div class="space-y-4">
                <div id="features-list-${index}">
                    ${features.map((feature, fIndex) => `
                        <div class="border border-gray-200 rounded-lg p-4 mb-4">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-medium">Feature #${fIndex + 1}</span>
                                <button onclick="sectionBuilder.removeFeature(${index}, ${fIndex})" 
                                        class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <input type="text" 
                                   value="${feature.icon || ''}" 
                                   onchange="sectionBuilder.updateFeature(${index}, ${fIndex}, 'icon', this.value)"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                                   placeholder="Icon class (e.g., fa-star)">
                            <input type="text" 
                                   value="${feature.title || ''}" 
                                   onchange="sectionBuilder.updateFeature(${index}, ${fIndex}, 'title', this.value)"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                                   placeholder="Feature title">
                            <textarea rows="2" 
                                      onchange="sectionBuilder.updateFeature(${index}, ${fIndex}, 'description', this.value)"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="Feature description">${feature.description || ''}</textarea>
                        </div>
                    `).join('')}
                </div>
                <button onclick="sectionBuilder.addFeature(${index})" 
                        class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors">
                    <i class="fas fa-plus mr-2"></i> Add Feature
                </button>
            </div>
        `;
    }
    
    showAddSectionModal() {
        let body = '<div class="grid grid-cols-2 gap-4">';
        
        Object.keys(this.sectionTypes).forEach(type => {
            const section = this.sectionTypes[type];
            body += `
                <button onclick="sectionBuilder.addSection('${type}')" 
                        class="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors flex flex-col items-center space-y-2">
                    <i class="fas ${section.icon} text-3xl text-primary"></i>
                    <span class="font-medium">${section.name}</span>
                </button>
            `;
        });
        
        body += '</div>';
        
        Modal.show({
            title: 'Add New Section',
            body: body,
            size: 'max-w-3xl'
        });
    }
    
    addSection(type) {
        const newSection = {
            id: Date.now(),
            type: type,
            order: this.sections.length,
            isVisible: true,
            content: {}
        };
        
        this.sections.push(newSection);
        this.render();
        Modal.close();
        Toast.success(`${this.sectionTypes[type].name} section added`);
    }
    
    deleteSection(index) {
        if (confirm('Are you sure you want to delete this section?')) {
            this.sections.splice(index, 1);
            this.render();
            Toast.success('Section deleted');
        }
    }
    
    toggleVisibility(index) {
        this.sections[index].isVisible = !this.sections[index].isVisible;
        this.render();
    }
    
    toggleCollapse(index) {
        const card = document.querySelectorAll('.section-card')[index];
        const content = card.querySelector('.section-content');
        const toggle = card.querySelector('.section-toggle');
        
        content.classList.toggle('hidden');
        toggle.classList.toggle('fa-chevron-down');
        toggle.classList.toggle('fa-chevron-up');
    }
    
    updateSection(index, field, value) {
        if (!this.sections[index].content) {
            this.sections[index].content = {};
        }
        this.sections[index].content[field] = value;
    }
    
    setupDragAndDrop() {
        const container = document.getElementById('sections-list');
        if (!container) return;
        
        let draggedElement = null;
        
        container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('section-card')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });
        
        container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('section-card')) {
                e.target.style.opacity = '1';
            }
        });
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggedElement);
            } else {
                container.insertBefore(draggedElement, afterElement);
            }
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            this.updateSectionOrder();
        });
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.section-card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    updateSectionOrder() {
        const cards = document.querySelectorAll('.section-card');
        const newOrder = [];
        
        cards.forEach((card, index) => {
            const oldIndex = parseInt(card.dataset.sectionIndex);
            newOrder.push(this.sections[oldIndex]);
        });
        
        this.sections = newOrder;
        this.render();
        Toast.success('Section order updated');
    }
    
    getSections() {
        return this.sections;
    }
    
    attachEventListeners() {
        // Re-attach any dynamic event listeners here
    }
    
    // Helper methods for nested content
    addTestimonial(sectionIndex) {
        if (!this.sections[sectionIndex].content.testimonials) {
            this.sections[sectionIndex].content.testimonials = [];
        }
        this.sections[sectionIndex].content.testimonials.push({
            name: '',
            position: '',
            text: ''
        });
        this.render();
    }
    
    removeTestimonial(sectionIndex, testimonialIndex) {
        this.sections[sectionIndex].content.testimonials.splice(testimonialIndex, 1);
        this.render();
    }
    
    updateTestimonial(sectionIndex, testimonialIndex, field, value) {
        this.sections[sectionIndex].content.testimonials[testimonialIndex][field] = value;
    }
    
    addFeature(sectionIndex) {
        if (!this.sections[sectionIndex].content.features) {
            this.sections[sectionIndex].content.features = [];
        }
        this.sections[sectionIndex].content.features.push({
            icon: '',
            title: '',
            description: ''
        });
        this.render();
    }
    
    removeFeature(sectionIndex, featureIndex) {
        this.sections[sectionIndex].content.features.splice(featureIndex, 1);
        this.render();
    }
    
    updateFeature(sectionIndex, featureIndex, field, value) {
        this.sections[sectionIndex].content.features[featureIndex][field] = value;
    }
    
    removeGalleryImage(sectionIndex, imageIndex) {
        this.sections[sectionIndex].content.images.splice(imageIndex, 1);
        this.render();
    }
    
    addGalleryImage(sectionIndex, imageUrl) {
        if (!this.sections[sectionIndex].content.images) {
            this.sections[sectionIndex].content.images = [];
        }
        this.sections[sectionIndex].content.images.push(imageUrl);
        this.render();
    }
}

// Initialize global instance
let sectionBuilder;

// Export
window.SectionBuilder = SectionBuilder;
