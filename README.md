# First Division - Digital Marketing Agency Website

## Project Overview
This is the codebase for First Division, a digital marketing agency website. The site is designed to showcase the agency's services, expertise, and results to potential clients.

## Project Structure

### Key Files
- `public/index.html` - Main HTML file with the website content
- `public/css/styles.css` - Consolidated CSS file containing all styles
- `public/js/script.js` - JavaScript for various interactions and animations
- `public/robots.txt` - Instructions for search engine crawlers
- `public/sitemap.xml` - XML sitemap for better search engine indexing

### Assets
- `public/assets/images/` - Contains all image files used throughout the site
  - `hero-video-background.png` - Background image for the hero section
  - Various social media icons

## Website Sections

### Navigation
The navigation bar is fixed at the top with links to each main section of the site. It includes:
- Services
- About
- Testimonials
- Contact

### Hero Section
The hero section features:
- Main headline "Transform Your Digital Presence"
- Subtitle highlighting value proposition
- CTA button for booking consultations
- Social proof with star ratings
- Video/image display with a custom black frame (video container)

### Quality Content Section
This section contains an interactive headline "Where quality content meets meaningful growth" with:
- Word-by-word organization using span elements
- Interactive hover effects via JavaScript
- Accent line animation on scroll

### Statistics Section
Displays key metrics with animated elements:
- Revenue increase percentage
- Number of leads generated
- Award-winning campaigns
- Pulsing icons and hover effects

### Services Container
The services section is divided into three main services:
1. SEO & Content Marketing
2. Paid Acquisition
3. Performance Analytics

Each service has:
- Service badge
- Title and description
- Feature list with check icons
- CTA button
- Visual icon presentation

### CTA Section
A final call-to-action section with:
- Large heading
- Prominent button for booking consultations

### Footer
Simple footer with copyright information.

## Styling Architecture

The CSS is organized into logical sections:
1. Global Variables (`:root`)
2. Global Styles
3. Hero Section
4. Navigation
5. Buttons & CTAs
6. Services Section
7. Quality Content Section
8. Statistics Section
9. Testimonials Section
10. Miscellaneous Styles
11. Form Controls
12. Contact Section
13. Footer
14. Responsive Adjustments

## JavaScript Features

1. **Scroll Detection** - For the quality content section to reveal text when scrolled into view
2. **Navbar Behavior** - Changes appearance when scrolling
3. **Interactive Elements** - Hover effects and animations

## SEO Optimization

The site includes:
- Comprehensive meta tags for search engines
- Open Graph tags for social media sharing
- Twitter Card support
- JSON-LD structured data for:
  - Business information
  - FAQs
  - Breadcrumbs
- XML sitemap with page priorities
- Robots.txt with crawl instructions

## Notes for Development

### Video Frame
The video container in the hero section has a black frame around it, created using:
```css
.video-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 10px;
    background: #000000; /* Black frame */
    -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
}
```

### Quality Content Section
The quality content section uses:
- Individual spans for each letter and word
- Data attributes for tracking word and letter indices
- JavaScript to reveal content when scrolled into view

### Responsive Design
The site is fully responsive with breakpoints at:
- 991px (tablets and smaller devices)
- 768px (mobile devices)

## Future Enhancements
- Add testimonials section
- Implement blog section
- Create case studies page
- Add contact form
- Enhance animations with GSAP

## Deployment
The site is configured for deployment with:
- A CNAME file for custom domain
- Proper SEO optimization for search engines

## License
Copyright © 2024 First Division. All rights reserved. 
