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
    
    // Only initialize portfolio carousel from script.js if we're not on the portfolio.html page
    // This prevents conflicts with portfolio.html's own initialization
    const portfolioCarousel = document.querySelector('.portfolio-carousel');
    if (portfolioCarousel && typeof $.fn.slick !== 'undefined' && !document.body.classList.contains('portfolio-page')) {
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
    // Check for language parameter in URL first
    const urlParams = new URLSearchParams(window.location.search);
    let currentLang = urlParams.get('lang');
    
    // If URL has language parameter, save it as preference
    if (currentLang && (currentLang === 'en' || currentLang === 'es')) {
        localStorage.setItem('preferredLanguage', currentLang);
    } else {
        // Check if we already have a language preference saved
        currentLang = localStorage.getItem('preferredLanguage');
        
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
    }
    
    // Language switcher setup (will be added to the navigation)
    createLanguageSwitcher();
    
    // Apply the language
    applyLanguage(currentLang);
    
    // Check if the user is from a Spanish-speaking country via IP (this is a simple check)
    checkCountryAndSuggestLanguage();
    
    // Update URL without refreshing page if needed
    updateLanguageURL(currentLang);
}

// Update URL to reflect current language without refreshing the page
function updateLanguageURL(lang) {
    const url = new URL(window.location);
    if (lang === 'es') {
        url.searchParams.set('lang', 'es');
    } else {
        url.searchParams.delete('lang'); // English is default, no parameter needed
    }
    
    // Update the URL without refreshing the page
    if (url.toString() !== window.location.toString()) {
        window.history.replaceState({}, '', url);
    }
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
            updateLanguageURL(lang);
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
        // Restore English meta tags and attributes
        restoreEnglish();
    }
    
    // Set the page language attribute
    document.documentElement.lang = lang;
}

// Translate the site to Spanish
function translateToSpanish() {
    // Comprehensive translation dictionary for all page elements
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
        
        // CTA Sections
        'Ready to Transform Your Digital Presence?': '¿Listo para Transformar Su Presencia Digital?',
        'Get Started Today': 'Comience Hoy Mismo',
        'Let\'s Work Together': 'Trabajemos Juntos',
        'Ready to Be Our Next Success Story?': '¿Listo para Ser Nuestra Próxima Historia de Éxito?',
        'Ready to Work With Us?': '¿Listo para Trabajar con Nosotros?',
        'Get in Touch Today': 'Contáctenos Hoy',
        'Partner with First Division Agency and join the ranks of luxury brands that have elevated their marketing to new heights.': 'Asóciese con First Division Agency y únase a las filas de marcas de lujo que han elevado su marketing a nuevas alturas.',
        
        // Footer
        'All rights reserved.': 'Todos los derechos reservados.',
        
        // Portfolio Page specific content
        'Drive Me Barcelona': 'Drive Me Barcelona',
        'First Division Agency produced a dynamic showcase video for this luxury car rental service in Barcelona, highlighting their premium fleet and exclusive customer experience. Our targeted campaign increased booking inquiries by 165% and helped secure high-value long-term rentals from international clients.': 'First Division Agency produjo un video dinámico para este servicio de alquiler de autos de lujo en Barcelona, destacando su flota premium y experiencia exclusiva. Nuestra campaña dirigida aumentó las consultas de reservas en un 165% y ayudó a asegurar alquileres a largo plazo de alto valor de clientes internacionales.',
        'First Division Agency\'s showcase video for luxury car rentals. Increased inquiries by 165% and secured high-value international clients.': 'Video de First Division Agency para alquiler de autos de lujo. Aumentó consultas en 165% y aseguró clientes internacionales de alto valor.',
        'Vinichi': 'Vinichi',
        'First Division Agency crafted a cinematic teaser video for this luxury sportswear brand that captured their premium aesthetics and performance focus. Our strategic campaign elevated brand perception, increased engagement by 215%, and drove a 78% boost in exclusive collection sales.': 'First Division Agency creó un video teaser cinematográfico para esta marca de ropa deportiva de lujo que capturó su estética premium y enfoque en rendimiento. Nuestra campaña estratégica elevó la percepción de marca, aumentó el engagement en 215% y impulsó un aumento del 78% en ventas de colección exclusiva.',
        'First Division Agency\'s cinematic video for luxury sportswear. Increased engagement by 215% and boosted sales by 78%.': 'Video cinematográfico de First Division Agency para ropa deportiva de lujo. Aumentó engagement en 215% e impulsó ventas en 78%.',
        
        // About Us Page specific content 
        'Our Story': 'Nuestra Historia',
        'How First Division Was Born': 'Cómo Nació First Division',
        'At First Division, our story starts with something simple — a shared passion for growth. We met at a local running club, not knowing that a few conversations would lead to the start of a media and marketing agency. What brought us together was more than just running. It was a mindset: a daily effort to improve, to stay consistent, and to aim higher in everything we do.': 'En First Division, nuestra historia comienza con algo simple: una pasión compartida por el crecimiento. Nos conocimos en un club de running local, sin saber que unas conversaciones llevarían al inicio de una agencia de medios y marketing. Lo que nos unió fue más que solo correr. Fue una mentalidad: un esfuerzo diario para mejorar, mantenerse consistente y apuntar más alto en todo lo que hacemos.',
        'At the time, both of us were creating content for our own social media accounts. We were experimenting with video, developing our creative style, and learning how to capture attention through storytelling. As we refined our skills, we saw an opportunity: to take that same passion and help businesses grow — not just in visibility, but in reputation and revenue.': 'En ese momento, ambos creábamos contenido para nuestras propias cuentas de redes sociales. Experimentábamos con video, desarrollando nuestro estilo creativo y aprendiendo cómo capturar atención a través de storytelling. Mientras refinábamos nuestras habilidades, vimos una oportunidad: tomar esa misma pasión y ayudar a los negocios a crecer, no solo en visibilidad, sino en reputación e ingresos.',
        'That\'s how First Division began.': 'Así es como comenzó First Division.',
        'Today, we specialize in working with luxury brands, premium e-commerce businesses, and high-end hospitality — from boutique hotels to exclusive villas. These industries demand more than just content. They demand storytelling that reflects quality, elegance, and experience. We help brands stand out in a crowded digital space through content that is clean, refined, and designed to convert.': 'Hoy nos especializamos en trabajar con marcas de lujo, negocios premium de e-commerce y hospitalidad de alta gama, desde hoteles boutique hasta villas exclusivas. Estas industrias demandan más que solo contenido. Demandan storytelling que refleje calidad, elegancia y experiencia. Ayudamos a las marcas a destacar en un espacio digital saturado a través de contenido que es limpio, refinado y diseñado para convertir.',
        'We handle everything from short-form video production to full-scale digital strategy, combining creative direction with performance marketing. Whether it\'s helping a luxury villa reach international travelers or positioning a premium e-commerce product for high-value clients, we work closely with each brand to build a tailored strategy that drives results.': 'Manejamos todo desde producción de video de formato corto hasta estrategia digital a gran escala, combinando dirección creativa con marketing de performance. Ya sea ayudando a una villa de lujo a llegar a viajeros internacionales o posicionando un producto premium de e-commerce para clientes de alto valor, trabajamos estrechamente con cada marca para construir una estrategia personalizada que genere resultados.',
        'At First Division, we\'re not just a content agency. We\'re growth partners. We care deeply about how your brand is seen and how it performs — and we\'re here to help you connect with the customers that matter most.': 'En First Division, no somos solo una agencia de contenido. Somos socios de crecimiento. Nos preocupamos profundamente por cómo se ve tu marca y cómo funciona, y estamos aquí para ayudarte a conectar con los clientes que más importan.',
        'Let\'s build something exceptional, together.': 'Construyamos algo excepcional, juntos.',
        
        // Core Values
        'Our Core Values': 'Nuestros Valores Fundamentales',
        'Results-Driven Approach': 'Enfoque Orientado a Resultados',
        'We measure our success by the results we deliver. Every strategy, campaign, and tactic is designed with clear, measurable objectives.': 'Medimos nuestro éxito por los resultados que entregamos. Cada estrategia, campaña y táctica está diseñada con objetivos claros y medibles.',
        'Creative Innovation': 'Innovación Creativa',
        'We constantly explore new ideas and approaches, staying ahead of digital trends to provide our clients with cutting-edge solutions.': 'Constantemente exploramos nuevas ideas y enfoques, manteniéndonos por delante de las tendencias digitales para brindar a nuestros clientes soluciones de vanguardia.',
        'Client Partnership': 'Asociación con Clientes',
        'We believe in building true partnerships with our clients, becoming an extension of their team rather than just a service provider.': 'Creemos en construir verdaderas asociaciones con nuestros clientes, convirtiéndonos en una extensión de su equipo en lugar de solo un proveedor de servicios.',
        'Data-Driven Decisions': 'Decisiones Basadas en Datos',
        'Every recommendation we make is backed by comprehensive data analysis, ensuring strategies that are both effective and efficient.': 'Cada recomendación que hacemos está respaldada por análisis de datos comprehensivo, asegurando estrategias que son efectivas y eficientes.',
        'Collaborative Excellence': 'Excelencia Colaborativa',
        'We believe that the best results come from combining diverse perspectives and skillsets in a collaborative environment.': 'Creemos que los mejores resultados vienen de combinar perspectivas diversas y habilidades en un ambiente colaborativo.',
        'Continuous Growth': 'Crecimiento Continuo',
        'We are committed to ongoing learning and development, constantly enhancing our expertise to deliver ever-improving results.': 'Estamos comprometidos con el aprendizaje y desarrollo continuo, mejorando constantemente nuestra experiencia para entregar resultados cada vez mejores.',
        
        // Page Titles (for dynamic title updates)
        'First Division Agency | Premier Digital Marketing Agency | Luxury Brand Marketing': 'First Division Agency | Agencia Premier de Marketing Digital | Marketing para Marcas de Lujo',
        'About First Division Agency | Premier Digital Marketing Agency Story & Team': 'Sobre First Division Agency | Historia y Equipo de Agencia Premier de Marketing Digital',
        'Portfolio - First Division Agency | Digital Marketing Case Studies & Success Stories': 'Portafolio - First Division Agency | Casos de Estudio y Historias de Éxito en Marketing Digital'
    };
    
    // Helper function to translate text content of elements
    function translateElements(selector, translationKey) {
        document.querySelectorAll(selector).forEach(el => {
            const originalText = el.textContent.trim();
            if (translations[originalText]) {
                el.textContent = translations[originalText];
            } else if (translationKey && translations[translationKey]) {
                el.textContent = translations[translationKey];
            }
        });
    }
    
    // Helper function to translate HTML content (for elements with nested HTML)
    function translateHTML(selector, originalText, translatedText) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.innerHTML = el.innerHTML.replace(originalText, translatedText);
        });
    }
    
    // Translate page title
    const currentTitle = document.title;
    if (translations[currentTitle]) {
        document.title = translations[currentTitle];
    }
    
    // Translate meta descriptions
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const currentDescription = metaDescription.getAttribute('content');
        // Add Spanish meta descriptions
        const spanishDescriptions = {
            'First Division Agency is a premier digital marketing agency specializing in luxury brands, e-commerce & hospitality. First Division delivers data-driven marketing strategies that elevate premium brands worldwide.': 'First Division Agency es una agencia premier de marketing digital especializada en marcas de lujo, e-commerce y hospitalidad. First Division ofrece estrategias de marketing basadas en datos que elevan marcas premium a nivel mundial.',
            'Learn about First Division Agency\'s journey to becoming a leading digital marketing agency. Discover our story, unique approach, and the expert team behind First Division\'s luxury marketing success.': 'Conozca el viaje de First Division Agency para convertirse en una agencia líder de marketing digital. Descubra nuestra historia, enfoque único y el equipo experto detrás del éxito de marketing de lujo de First Division.',
            'Explore First Division Agency\'s portfolio of successful digital marketing campaigns. View our work with leading luxury brands and the measurable results we\'ve delivered as a premier marketing agency.': 'Explore el portafolio de First Division Agency de campañas exitosas de marketing digital. Vea nuestro trabajo con marcas de lujo líderes y los resultados medibles que hemos entregado como agencia premier de marketing.'
        };
        if (spanishDescriptions[currentDescription]) {
            metaDescription.setAttribute('content', spanishDescriptions[currentDescription]);
        }
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
    
    // Translate CTA sections
    translateElements('.consulting-cta-section h2');
    translateElements('.consulting-cta-section .cta-button');
    translateElements('.consulting-cta-section p.lead');
    
    // Translate portfolio page elements
    translateElements('.portfolio-title');
    translateElements('.portfolio-description');
    translateElements('.portfolio-overlay h3');
    translateElements('.portfolio-overlay .desktop-text');
    translateElements('.portfolio-overlay .mobile-text');
    
    // Translate about us page elements
    translateElements('.about-title');
    translateElements('.about-subtitle');
    translateElements('.about-description');
    translateElements('.story-highlight');
    translateElements('.value-title');
    translateElements('.value-item p');
    
    // Translate footer
    const footerText = document.querySelector('footer p.mb-0');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('All rights reserved.', 'Todos los derechos reservados.');
    }
    
    // Update hreflang attributes for Spanish
    document.querySelectorAll('link[hreflang]').forEach(link => {
        if (link.getAttribute('hreflang') === 'x-default' && link.getAttribute('href').includes('?lang=es')) {
            link.remove();
        }
    });
    
    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
        ogLocale.setAttribute('content', 'es_ES');
    }
    
    // Update language meta tags
    const languageMeta = document.querySelector('meta[name="language"]');
    if (languageMeta) {
        languageMeta.setAttribute('content', 'es');
    }
    
    const contentLanguageMeta = document.querySelector('meta[http-equiv="content-language"]');
    if (contentLanguageMeta) {
        contentLanguageMeta.setAttribute('content', 'es');
    }
    
    // Update document language attribute
    document.documentElement.setAttribute('lang', 'es');
}

// Restore English language settings
function restoreEnglish() {
    // Only restore if we're not already in English
    if (document.documentElement.lang === 'en') {
        return;
    }
    
    // Reload the page to restore original English content
    // This is the simplest approach to ensure all content is restored properly
    location.reload();
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
        updateLanguageURL('es');
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
