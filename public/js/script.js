document.addEventListener('DOMContentLoaded', function() {
    // Add navbar scroll behavior to change background on scroll
    initNavbarScroll();
    
    // Mobile navigation improvements
    initMobileNavigation();
    
    // Testimonials Carousel
    initTestimonialsCarousel();
    
    // Counters Animation
    initCountersAnimation();
    
    // Quality Content section animation
    handleQualityContentSection();
}); 

// Handle Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    // Initial check in case the page is already scrolled
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link:not(.cta-button)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only for links that point to sections on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Adjust for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            }
        });
    });
}

// Mobile Navigation Improvements
function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Add class for animation
    navbarCollapse.addEventListener('show.bs.collapse', function () {
        setTimeout(() => {
            navbarCollapse.classList.add('show');
        }, 50);
    });
    
    navbarCollapse.addEventListener('hide.bs.collapse', function () {
        navbarCollapse.classList.remove('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        // Skip if menu is not open or if click is on/inside the toggle button or navbar
        if (!navbarCollapse.classList.contains('show') || 
            navbarToggler.contains(e.target) ||
            navbarNav.contains(e.target)) {
            return;
        }
        
        // If menu is open and click is outside, close it
        if (navbarCollapse.classList.contains('show') && !navbarCollapse.contains(e.target)) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
    
    // Add smooth transition for menu
    navbarToggler.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
}

// Initialize Testimonials Carousel
function initTestimonialsCarousel() {
    const prevButton = document.getElementById('prevTestimonial');
    const nextButton = document.getElementById('nextTestimonial');
    const indicators = document.querySelectorAll('.indicator');
    const testimonialCards = document.querySelectorAll('.testimonials-row .col-lg-4');
    
    if (!prevButton || !nextButton || testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;
    
    // Only initialize carousel for mobile views
    if (window.innerWidth < 992) {
        setupMobileCarousel();
    }
    
    // Reinitialize on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 992) {
            setupMobileCarousel();
        } else {
            // Reset for desktop view
            testimonialCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });
    
    function setupMobileCarousel() {
        // Hide all cards except the first one
        testimonialCards.forEach((card, index) => {
            if (index === 0) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update indicators
        updateIndicators();
        
        // Add click events to buttons
        prevButton.addEventListener('click', showPrevSlide);
        nextButton.addEventListener('click', showNextSlide);
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }
    
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }
    
    function updateCarousel() {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show current testimonial
        testimonialCards[currentIndex].style.display = 'block';
        
        // Add fade-in animation
        testimonialCards[currentIndex].classList.remove('animate__fadeInUp');
        void testimonialCards[currentIndex].offsetWidth; // Trigger a reflow
        testimonialCards[currentIndex].classList.add('animate__fadeInUp');
        
        // Update indicators
        updateIndicators();
    }
    
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Animate counters when visible
function initCountersAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    // Set up Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
                
                // Start counting if it's a number
                const counterValue = entry.target.innerText;
                if (counterValue.includes('%') || counterValue.includes('x')) {
                    animateCounter(entry.target);
                }
                
                // Unobserve the element to avoid repeated animations
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all counter elements
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    // Function to animate a counter from 0 to its target value
    function animateCounter(counterElement) {
        const finalValue = counterElement.innerText;
        let suffix = '';
        let targetValue = 0;
        
        if (finalValue.includes('%')) {
            targetValue = parseInt(finalValue);
            suffix = '%';
        } else if (finalValue.includes('x')) {
            targetValue = parseFloat(finalValue);
            suffix = 'x';
        } else if (finalValue.includes('h')) {
            targetValue = parseFloat(finalValue);
            suffix = 'h';
        } else {
            targetValue = parseInt(finalValue);
        }
        
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const interval = 16; // ~60fps
        const increment = (targetValue / (duration / interval));
        
        counterElement.innerText = '0' + suffix;
        
        const timer = setInterval(() => {
            startValue += increment;
            
            if (startValue >= targetValue) {
                counterElement.innerText = finalValue;
                clearInterval(timer);
            } else {
                if (suffix === 'x' || suffix === 'h') {
                    counterElement.innerText = startValue.toFixed(1) + suffix;
                } else {
                    counterElement.innerText = Math.floor(startValue) + suffix;
                }
            }
        }, interval);
    }
}

// Quality Content section animation
function handleQualityContentSection() {
    const section = document.querySelector('.quality-content-section');
    const heading = document.getElementById('quality-content-heading');
    const accentLine = section.querySelector('.accent-line');
    
    if (!section || !heading || !accentLine) return;
    
    // Set initial opacity
    heading.style.opacity = '0';
    accentLine.style.opacity = '0';
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Different thresholds for different sized screens
        let threshold = 0.3; // Default threshold (30% of element needs to be visible)
        
        if (window.innerWidth < 768) {
            threshold = 0.2; // On mobile, only need 20% of element to be visible
        }
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    }
    
    // Function to handle scroll events
    function handleScroll() {
        if (isInViewport(section)) {
            heading.style.opacity = '1';
            accentLine.style.opacity = '1';
            accentLine.style.width = '150px';
        } else {
            heading.style.opacity = '0';
            accentLine.style.opacity = '0';
            accentLine.style.width = '80px';
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger on page load too
    handleScroll();
}

// Resize event handler for responsive adjustments
window.addEventListener('resize', function() {
    // Recalculate heights and positions where needed
    adjustHeightsForMobile();
});

// Adjust heights for better mobile experience
function adjustHeightsForMobile() {
    // Adjust video container height on mobile
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        if (window.innerWidth < 768) {
            // Set a fixed aspect ratio on mobile
            const width = videoContainer.offsetWidth;
            videoContainer.style.height = (width * 0.56) + 'px'; // 16:9 aspect ratio
        } else {
            videoContainer.style.height = '';
        }
    }
    
    // Adjust other responsive elements if needed
} 
