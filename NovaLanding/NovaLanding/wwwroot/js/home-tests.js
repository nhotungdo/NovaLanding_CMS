// NovaLanding Home Page - Testing Suite
// This file contains tests for the home page functionality

console.log('🧪 NovaLanding Home Page Tests');
console.log('================================');

// Test 1: Check if all required sections exist
function testSectionsExist() {
    console.log('\n📋 Test 1: Checking if all sections exist...');
    
    const sections = [
        { id: 'features', name: 'Features Section' },
        { id: 'about', name: 'About Section' },
        { id: 'pricing', name: 'Pricing Section' },
        { id: 'contact', name: 'Contact Section' }
    ];
    
    let passed = 0;
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            console.log(`✅ ${section.name} found`);
            passed++;
        } else {
            console.log(`❌ ${section.name} NOT found`);
        }
    });
    
    console.log(`Result: ${passed}/${sections.length} sections found`);
    return passed === sections.length;
}

// Test 2: Check navigation functionality
function testNavigation() {
    console.log('\n🧭 Test 2: Checking navigation...');
    
    const nav = document.querySelector('.home-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    let passed = 0;
    let total = 3;
    
    if (nav) {
        console.log('✅ Navigation bar found');
        passed++;
    } else {
        console.log('❌ Navigation bar NOT found');
    }
    
    if (navLinks.length >= 4) {
        console.log(`✅ Navigation links found (${navLinks.length})`);
        passed++;
    } else {
        console.log(`❌ Insufficient navigation links (${navLinks.length})`);
    }
    
    if (mobileToggle) {
        console.log('✅ Mobile menu toggle found');
        passed++;
    } else {
        console.log('❌ Mobile menu toggle NOT found');
    }
    
    console.log(`Result: ${passed}/${total} navigation tests passed`);
    return passed === total;
}

// Test 3: Check responsive design elements
function testResponsiveDesign() {
    console.log('\n📱 Test 3: Checking responsive design...');
    
    const viewport = window.innerWidth;
    console.log(`Current viewport width: ${viewport}px`);
    
    const heroSection = document.querySelector('.hero-section');
    const featuresGrid = document.querySelector('.features-grid');
    const pricingGrid = document.querySelector('.pricing-grid');
    
    let passed = 0;
    let total = 3;
    
    if (heroSection) {
        const computedStyle = window.getComputedStyle(heroSection);
        console.log(`✅ Hero section responsive: padding = ${computedStyle.padding}`);
        passed++;
    } else {
        console.log('❌ Hero section NOT found');
    }
    
    if (featuresGrid) {
        const computedStyle = window.getComputedStyle(featuresGrid);
        console.log(`✅ Features grid responsive: display = ${computedStyle.display}`);
        passed++;
    } else {
        console.log('❌ Features grid NOT found');
    }
    
    if (pricingGrid) {
        const computedStyle = window.getComputedStyle(pricingGrid);
        console.log(`✅ Pricing grid responsive: display = ${computedStyle.display}`);
        passed++;
    } else {
        console.log('❌ Pricing grid NOT found');
    }
    
    console.log(`Result: ${passed}/${total} responsive tests passed`);
    return passed === total;
}

// Test 4: Check form functionality
function testContactForm() {
    console.log('\n📝 Test 4: Checking contact form...');
    
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    let passed = 0;
    let total = 5;
    
    if (form) {
        console.log('✅ Contact form found');
        passed++;
    } else {
        console.log('❌ Contact form NOT found');
    }
    
    if (nameInput) {
        console.log('✅ Name input found');
        passed++;
    } else {
        console.log('❌ Name input NOT found');
    }
    
    if (emailInput && emailInput.type === 'email') {
        console.log('✅ Email input found with correct type');
        passed++;
    } else {
        console.log('❌ Email input NOT found or incorrect type');
    }
    
    if (subjectInput) {
        console.log('✅ Subject input found');
        passed++;
    } else {
        console.log('❌ Subject input NOT found');
    }
    
    if (messageInput && messageInput.tagName === 'TEXTAREA') {
        console.log('✅ Message textarea found');
        passed++;
    } else {
        console.log('❌ Message textarea NOT found');
    }
    
    console.log(`Result: ${passed}/${total} form tests passed`);
    return passed === total;
}

// Test 5: Check performance metrics
function testPerformance() {
    console.log('\n⚡ Test 5: Checking performance...');
    
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        console.log(`DOM ready time: ${domReady}ms`);
        
        if (loadTime < 3000) {
            console.log('✅ Page load time is good (< 3s)');
        } else {
            console.log('⚠️ Page load time could be improved (> 3s)');
        }
        
        if (domReady < 2000) {
            console.log('✅ DOM ready time is good (< 2s)');
        } else {
            console.log('⚠️ DOM ready time could be improved (> 2s)');
        }
        
        return loadTime < 3000 && domReady < 2000;
    } else {
        console.log('⚠️ Performance API not available');
        return false;
    }
}

// Test 6: Check accessibility
function testAccessibility() {
    console.log('\n♿ Test 6: Checking accessibility...');
    
    let passed = 0;
    let total = 4;
    
    // Check for alt attributes on images
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'));
    if (images.length === 0 || imagesWithAlt.length === images.length) {
        console.log(`✅ All images have alt attributes (${images.length})`);
        passed++;
    } else {
        console.log(`❌ Some images missing alt attributes (${imagesWithAlt.length}/${images.length})`);
    }
    
    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    let inputsWithLabels = 0;
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label || input.hasAttribute('aria-label')) {
            inputsWithLabels++;
        }
    });
    if (inputs.length === 0 || inputsWithLabels === inputs.length) {
        console.log(`✅ All form inputs have labels (${inputs.length})`);
        passed++;
    } else {
        console.log(`❌ Some inputs missing labels (${inputsWithLabels}/${inputs.length})`);
    }
    
    // Check for heading hierarchy
    const h1 = document.querySelectorAll('h1');
    if (h1.length >= 1) {
        console.log(`✅ Page has main heading (${h1.length} h1 elements)`);
        passed++;
    } else {
        console.log('❌ Page missing main heading');
    }
    
    // Check for semantic HTML
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const sections = document.querySelectorAll('section');
    if (nav && footer && sections.length > 0) {
        console.log(`✅ Semantic HTML elements found (nav, footer, ${sections.length} sections)`);
        passed++;
    } else {
        console.log('❌ Missing some semantic HTML elements');
    }
    
    console.log(`Result: ${passed}/${total} accessibility tests passed`);
    return passed === total;
}

// Test 7: Check browser compatibility
function testBrowserCompatibility() {
    console.log('\n🌐 Test 7: Checking browser compatibility...');
    
    const userAgent = navigator.userAgent;
    console.log(`User Agent: ${userAgent}`);
    
    let passed = 0;
    let total = 3;
    
    // Check for CSS Grid support
    if (CSS.supports('display', 'grid')) {
        console.log('✅ CSS Grid supported');
        passed++;
    } else {
        console.log('❌ CSS Grid NOT supported');
    }
    
    // Check for Flexbox support
    if (CSS.supports('display', 'flex')) {
        console.log('✅ Flexbox supported');
        passed++;
    } else {
        console.log('❌ Flexbox NOT supported');
    }
    
    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
        console.log('✅ IntersectionObserver supported');
        passed++;
    } else {
        console.log('❌ IntersectionObserver NOT supported');
    }
    
    console.log(`Result: ${passed}/${total} compatibility tests passed`);
    return passed === total;
}

// Run all tests
function runAllTests() {
    console.log('\n🚀 Running all tests...\n');
    
    const results = {
        sections: testSectionsExist(),
        navigation: testNavigation(),
        responsive: testResponsiveDesign(),
        form: testContactForm(),
        performance: testPerformance(),
        accessibility: testAccessibility(),
        compatibility: testBrowserCompatibility()
    };
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    console.log('\n================================');
    console.log('📊 Test Summary');
    console.log('================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n⚠️ Some tests failed. Please review the results above.');
    }
    
    return results;
}

// Auto-run tests when page is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 1000);
    });
} else {
    setTimeout(runAllTests, 1000);
}

// Export for manual testing
window.NovaLandingTests = {
    runAll: runAllTests,
    testSections: testSectionsExist,
    testNavigation: testNavigation,
    testResponsive: testResponsiveDesign,
    testForm: testContactForm,
    testPerformance: testPerformance,
    testAccessibility: testAccessibility,
    testCompatibility: testBrowserCompatibility
};

console.log('\n💡 Tip: Run individual tests using window.NovaLandingTests.testName()');
