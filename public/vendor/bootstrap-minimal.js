// Minimal Bootstrap JavaScript - Only Navbar Toggle Functionality
(function() {
  'use strict';
  
  // Navbar Collapse Toggle
  document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
    
    toggleButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetSelector = this.getAttribute('data-bs-target');
        const target = document.querySelector(targetSelector);
        
        if (target) {
          if (target.classList.contains('show')) {
            target.classList.remove('show');
            this.setAttribute('aria-expanded', 'false');
          } else {
            target.classList.add('show');
            this.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
    
    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
      const navbarCollapses = document.querySelectorAll('.navbar-collapse.show');
      
      navbarCollapses.forEach(function(collapse) {
        if (!collapse.contains(e.target) && !e.target.closest('.navbar-toggler')) {
          collapse.classList.remove('show');
          const toggler = document.querySelector('[data-bs-target="#' + collapse.id + '"]');
          if (toggler) {
            toggler.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
    
    // Close navbar when clicking nav links (mobile)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        const navbarCollapse = this.closest('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
          const toggler = document.querySelector('[data-bs-target="#' + navbarCollapse.id + '"]');
          if (toggler) {
            toggler.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  });
})();