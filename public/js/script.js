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
    
    // Set up Google Ads conversion tracking for CTA buttons
    setupConversionTracking();
    
    // Initialize language detection and translation
    initLanguageHandling();
    
    // Initialize portfolio page carousel if we're on the portfolio page
    const portfolioCarousel = document.querySelector('.portfolio-carousel');
    if (portfolioCarousel && typeof $.fn.slick !== 'undefined') {
        $('.portfolio-carousel').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
        
        // Play videos on hover
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const video = item.querySelector('video');
            if (video) {
                item.addEventListener('mouseenter', () => {
                    video.play();
                });
                
                item.addEventListener('mouseleave', () => {
                    video.pause();
                });
            }
        });
    }
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

// Set up Google Ads conversion tracking for all CTA buttons
function setupConversionTracking() {
    // Select all CTA buttons on the page
    const ctaButtons = document.querySelectorAll('.cta-button, .service-cta');
    
    // Add click event listeners to each button
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Check if it's an outbound link (not starting with # or javascript:)
            const href = button.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                // If it's an external link, use the gtag_report_conversion function
                if (typeof gtag_report_conversion === 'function') {
                    e.preventDefault(); // Prevent default navigation
                    console.log('Outbound click conversion tracked for:', button.textContent.trim());
                    gtag_report_conversion(href); // This handles the redirect
                    return false;
                }
            }
            
            // For internal links or if gtag_report_conversion isn't available, use the regular tracking
            if (typeof gtag === 'function') {
                // Send the conversion event to Google Ads
                gtag('event', 'conversion', {
                    'send_to': 'AW-16917883729/kN3OCIPQrPcYEP6v06Qp',
                    'value': 1.0,
                    'currency': 'USD',
                    'transaction_id': ''
                });
                
                // Also send a custom event to Google Analytics
                gtag('event', 'cta_button_click', {
                    'event_category': 'engagement',
                    'event_label': button.textContent.trim(),
                    'value': 1
                });
                
                console.log('Conversion tracked for button:', button.textContent.trim());
            }
        });
    });
    
    // Also track form submissions if there are any forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16917883729/8l7FCKDRrPcYEP6v06Qp',
                    'value': 1.0,
                    'currency': 'USD'
                });
                
                // Also send a form submission event to Google Analytics
                gtag('event', 'form_submission', {
                    'event_category': 'lead',
                    'event_label': form.getAttribute('id') || 'contact_form',
                    'value': 1
                });
                
                console.log('Form submission conversion tracked');
            }
        });
    });
}

// Handle language detection and translation
function initLanguageHandling() {
    // Check if we already have a language preference saved
    let currentLang = localStorage.getItem('preferredLanguage');
    
    // If no saved preference, try to detect browser language
    if (!currentLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('es')) {
            currentLang = 'es'; // Spanish
        } else {
            currentLang = 'en'; // Default to English
        }
        // Save the detected language
        localStorage.setItem('preferredLanguage', currentLang);
    }
    
    // Language switcher setup (will be added to the navigation)
    createLanguageSwitcher();
    
    // Apply the language
    applyLanguage(currentLang);
    
    // Check if the user is from a Spanish-speaking country via IP (this is a simple check)
    checkCountryAndSuggestLanguage();
}

// Create language switcher UI
function createLanguageSwitcher() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;
    
    // Create language switcher list item
    const langSwitcherLi = document.createElement('li');
    langSwitcherLi.className = 'nav-item dropdown language-switcher';
    
    // Create dropdown toggle
    const dropdownToggle = document.createElement('a');
    dropdownToggle.className = 'nav-link dropdown-toggle';
    dropdownToggle.href = '#';
    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.id = 'languageDropdown';
    dropdownToggle.innerHTML = '<i class="fas fa-globe"></i> <span class="lang-text">Language</span>';
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
    dropdownMenu.setAttribute('aria-labelledby', 'languageDropdown');
    
    // Add English option
    const englishOption = document.createElement('a');
    englishOption.className = 'dropdown-item language-option';
    englishOption.href = '#';
    englishOption.setAttribute('data-lang', 'en');
    englishOption.textContent = 'English';
    
    // Add Spanish option
    const spanishOption = document.createElement('a');
    spanishOption.className = 'dropdown-item language-option';
    spanishOption.href = '#';
    spanishOption.setAttribute('data-lang', 'es');
    spanishOption.textContent = 'Español';
    
    // Assemble the dropdown
    dropdownMenu.appendChild(englishOption);
    dropdownMenu.appendChild(spanishOption);
    langSwitcherLi.appendChild(dropdownToggle);
    langSwitcherLi.appendChild(dropdownMenu);
    
    // Insert before the Contact Us button
    const contactItem = navbarNav.querySelector('.nav-item:last-child');
    navbarNav.insertBefore(langSwitcherLi, contactItem);
    
    // Add event listeners for language options
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', lang);
            applyLanguage(lang);
        });
    });
}

// Apply selected language to the site
function applyLanguage(lang) {
    // Update active state in the dropdown
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update the language indicator text
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = lang === 'es' ? 'Idioma' : 'Language';
    }
    
    // If Spanish, translate the site
    if (lang === 'es') {
        translateToSpanish();
    } else {
        // Restore English (reload the page for simplicity)
        if (document.documentElement.lang !== 'en') {
            location.reload();
        }
    }
    
    // Set the page language attribute
    document.documentElement.lang = lang;
}

// Translate the site to Spanish
function translateToSpanish() {
    // Translation dictionary for key elements
    const translations = {
        // Navigation
        'Home': 'Inicio',
        'Services': 'Servicios',
        'Our Portfolio': 'Nuestro Portafolio',
        'About Us': 'Sobre Nosotros',
        'Contact Us': 'Contáctenos',
        
        // Hero Section
        'Digital Marketing Agency': 'Agencia de Marketing Digital',
        'Transform Your Digital Presence': 'Transforme Su Presencia Digital',
        'We deliver results. Our proven strategies drive revenue growth, attract high-value customers, and help brands scale with certainty.': 'Entregamos resultados. Nuestras estrategias comprobadas impulsan el crecimiento de ingresos, atraen clientes de alto valor y ayudan a las marcas a escalar con certeza.',
        'Get Started': 'Comenzar Ahora',
        
        // Quality Content Section
        'Where quality content meets meaningful growth.': 'Donde el contenido de calidad se encuentra con el crecimiento significativo.',
        
        // Services Section
        'Strategy': 'Estrategia',
        'Organic Growth': 'Crecimiento Orgánico',
        'Dominate your market with data-driven SEO strategies and engaging social media campaigns that create lasting impact. We help your business build a strong online foundation that generates traffic and leads without relying solely on paid advertising.': 'Domine su mercado con estrategias de SEO basadas en datos y campañas atractivas de redes sociales que crean un impacto duradero. Ayudamos a su negocio a construir una base sólida en línea que genera tráfico y clientes potenciales sin depender únicamente de la publicidad pagada.',
        'Search Engine Optimization (SEO)': 'Optimización para Motores de Búsqueda (SEO)',
        'Content Marketing Strategy': 'Estrategia de Marketing de Contenidos',
        'Social Media Growth': 'Crecimiento en Redes Sociales',
        'Link Building & Authority Development': 'Construcción de Enlaces y Desarrollo de Autoridad',
        'Get Started': 'Comenzar Ahora',
        
        'Most Popular': 'Más Popular',
        'Paid Acquisition': 'Adquisición Pagada',
        'Scale your business with precision-targeted paid campaigns that maximize ROI and capture high-intent customers. Our data-driven approach ensures your advertising budget is optimized for the highest possible return.': 'Escale su negocio con campañas pagas de precisión que maximizan el ROI y capturan clientes con alta intención. Nuestro enfoque basado en datos asegura que su presupuesto publicitario sea optimizado para el mayor retorno posible.',
        'Google & Bing Ads Management': 'Gestión de Anuncios de Google y Bing',
        'Social Media Advertising': 'Publicidad en Redes Sociales',
        'Retargeting Campaigns': 'Campañas de Retargeting',
        'Landing Page Optimization': 'Optimización de Páginas de Destino',
        
        'Insights': 'Análisis',
        'Performance Analytics': 'Análisis de Rendimiento',
        'Make data-driven decisions with real-time analytics and actionable insights that fuel continuous growth. Our advanced analytics solutions help you understand exactly what's working and what needs optimization.': 'Tome decisiones basadas en datos con análisis en tiempo real e información procesable que impulsa el crecimiento continuo. Nuestras soluciones avanzadas de análisis le ayudan a entender exactamente qué está funcionando y qué necesita optimización.',
        'Custom Analytics Dashboard': 'Panel de Análisis Personalizado',
        'Conversion Tracking & Optimization': 'Seguimiento y Optimización de Conversiones',
        'User Behavior Analysis': 'Análisis de Comportamiento del Usuario',
        'ROI & Performance Reporting': 'Informes de ROI y Rendimiento',
        
        // CTA Section
        'Ready to Transform Your Digital Presence?': '¿Listo para Transformar Su Presencia Digital?',
        'Get Started Today': 'Comience Hoy Mismo',
        'Let\'s Work Together': 'Trabajemos Juntos',
        
        // Footer
        'All rights reserved.': 'Todos los derechos reservados.',
        
        // Portfolio Page
        'Our Portfolio': 'Nuestro Portafolio',
        'Explore our showcase of successful client campaigns and creative solutions. Each project represents our commitment to driving meaningful results and transforming digital presence through innovative strategies.': 'Explore nuestra muestra de campañas exitosas y soluciones creativas. Cada proyecto representa nuestro compromiso de impulsar resultados significativos y transformar la presencia digital a través de estrategias innovadoras.',
        'Ready to Be Our Next Success Story?': '¿Listo para Ser Nuestra Próxima Historia de Éxito?',
        
        // About Us Page
        'Our Story': 'Nuestra Historia',
        'How First Division Was Born': 'Cómo Nació First Division',
        'Our Core Values': 'Nuestros Valores Fundamentales',
        'Results-Driven Approach': 'Enfoque Orientado a Resultados',
        'Creative Innovation': 'Innovación Creativa',
        'Client Partnership': 'Asociación con Clientes',
        'Data-Driven Decisions': 'Decisiones Basadas en Datos',
        'Collaborative Excellence': 'Excelencia Colaborativa',
        'Continuous Growth': 'Crecimiento Continuo',
        'Ready to Work With Us?': '¿Listo para Trabajar con Nosotros?',
        'Get in Touch Today': 'Contáctenos Hoy'
    };
    
    // Helper function to translate text content of elements
    function translateElements(selector, translationKey) {
        document.querySelectorAll(selector).forEach(el => {
            if (translations[el.textContent.trim()]) {
                el.textContent = translations[el.textContent.trim()];
            } else if (translationKey && translations[translationKey]) {
                el.textContent = translations[translationKey];
            }
        });
    }
    
    // Translate navigation links
    translateElements('.nav-link:not(.cta-button):not(.dropdown-toggle)');
    translateElements('.nav-link.cta-button');
    
    // Translate hero section
    translateElements('.badge.bg-accent');
    translateElements('.main-title');
    translateElements('.hero-subtitle');
    translateElements('.cta-button');
    
    // Translate quality content section
    translateElements('#quality-content-heading');
    
    // Translate services section
    translateElements('.service-badge');
    translateElements('.service-title');
    translateElements('.service-description');
    translateElements('.feature-item span');
    translateElements('.service-cta');
    
    // Translate CTA section
    translateElements('.consulting-cta-section h2');
    translateElements('.consulting-cta-section .cta-button');
    
    // Translate portfolio page elements
    translateElements('.portfolio-title');
    translateElements('.portfolio-description');
    
    // Translate about us page elements
    translateElements('.about-title');
    translateElements('.about-subtitle');
    translateElements('.about-description');
    translateElements('.value-title');
    
    // Translate footer
    const footerText = document.querySelector('footer p.mb-0');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('All rights reserved.', 'Todos los derechos reservados.');
    }
}

// Check user's country via IP and suggest language change if from Spanish-speaking country
function checkCountryAndSuggestLanguage() {
    // Use a free IP geolocation API (no API key required)
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            // List of Spanish-speaking countries by country code
            const spanishCountries = [
                'ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 
                'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 
                'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ'
            ];
            
            // If user is from a Spanish-speaking country and currently viewing in English
            if (spanishCountries.includes(data.country_code) && localStorage.getItem('preferredLanguage') !== 'es') {
                // Show language suggestion banner after a short delay
                setTimeout(() => {
                    showLanguageSuggestion();
                }, 2000);
            }
        })
        .catch(error => {
            console.log('Unable to detect user country:', error);
        });
}

// Show suggestion banner for Spanish-speaking users
function showLanguageSuggestion() {
    // Create suggestion banner
    const banner = document.createElement('div');
    banner.className = 'language-suggestion-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,0.9);
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        gap: 20px;
    `;
    
    banner.innerHTML = `
        <div>¿Prefieres ver esta página en español?</div>
        <button id="switchToSpanish" class="btn btn-light btn-sm">Sí, cambiar a español</button>
        <button id="keepEnglish" class="btn btn-outline-light btn-sm">No, keep in English</button>
        <button id="closeBanner" class="btn-close btn-close-white" aria-label="Close"></button>
    `;
    
    // Add banner to page
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('switchToSpanish').addEventListener('click', function() {
        localStorage.setItem('preferredLanguage', 'es');
        applyLanguage('es');
        banner.remove();
    });
    
    document.getElementById('keepEnglish').addEventListener('click', function() {
        localStorage.setItem('preferredLanguage', 'en');
        banner.remove();
    });
    
    document.getElementById('closeBanner').addEventListener('click', function() {
        banner.remove();
    });
} 
