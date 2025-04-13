/**
 * First Division - Main JavaScript
 * Handles various interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===================================================
    // Navbar Behavior on Scroll
    // ===================================================
    const navbar = document.querySelector('#mainNav');
    
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initialize navbar state on page load
    handleNavbarScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ===================================================
    // Smooth Scrolling for Internal Links
    // ===================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just a # link
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.getBoundingClientRect().height;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================================
    // Animated Counters in Stats Section
    // ===================================================
    const counterElements = document.querySelectorAll('.counter');
    let countersInitialized = false;
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    function animateCounters() {
        if (countersInitialized) return; // Only run once
        
        // Check if first counter is in viewport
        if (counterElements.length > 0 && isInViewport(counterElements[0])) {
            counterElements.forEach(counter => {
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isPlus = target.includes('+');
                
                // Extract the numeric value
                let numericValue = parseInt(target.replace(/\D/g, ''));
                const duration = 2000; // Animation duration in milliseconds
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                
                let currentNumber = 0;
                const increment = numericValue / totalFrames;
                
                const animation = setInterval(() => {
                    currentNumber += increment;
                    
                    if (currentNumber >= numericValue) {
                        currentNumber = numericValue;
                        clearInterval(animation);
                    }
                    
                    let displayValue = Math.floor(currentNumber).toLocaleString();
                    
                    if (isPercentage) displayValue += '%';
                    if (isPlus) displayValue += '+';
                    
                    counter.textContent = displayValue;
                }, frameDuration);
            });
            
            countersInitialized = true;
        }
    }
    
    // Check counters on scroll
    window.addEventListener('scroll', animateCounters);
    // Check on initial load too
    animateCounters();
    
    // ===================================================
    // Quality Content Section Word Hover Effects
    // ===================================================
    const headingWords = document.querySelectorAll('.heading-word');
    
    if (headingWords.length > 0) {
        headingWords.forEach(word => {
            word.addEventListener('mouseenter', function() {
                const letters = this.querySelectorAll('.heading-letter');
                letters.forEach(letter => {
                    letter.style.opacity = '1';
                    letter.style.color = '#E6F3FF'; // Use accent color
                    letter.style.textShadow = '0 0 15px rgba(230, 243, 255, 0.8)';
                });
            });
            
            word.addEventListener('mouseleave', function() {
                const letters = this.querySelectorAll('.heading-letter');
                letters.forEach(letter => {
                    letter.style.opacity = '0.7';
                    letter.style.color = 'white';
                    letter.style.textShadow = 'none';
                });
            });
        });
        
        // Set initial opacity
        document.querySelectorAll('.heading-letter').forEach(letter => {
            letter.style.opacity = '0.7';
            letter.style.transition = 'all 0.3s ease';
        });
    }
}); 
