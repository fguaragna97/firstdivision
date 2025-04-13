# First Division Marketing Agency Website

This repository contains the front-end code for the First Division marketing agency website.

## Project Structure

```
firstdivision/
├── public/                # Main public directory
│   ├── index.html         # Main HTML file
│   ├── thank-you.html     # Thank you page
│   ├── sitemap.xml        # XML sitemap for SEO
│   ├── robots.txt         # Robots.txt file for SEO
│   ├── manifest.json      # Web app manifest
│   ├── favicon.svg        # Favicon
│   ├── css/               # CSS styles
│   │   └── styles.css     # Main stylesheet
│   ├── js/                # JavaScript files
│   │   └── script.js      # Main script file
│   └── assets/            # Assets directory
│       └── videos/        # Video files
│           └── Background.mp4  # Hero section background video
│       └── images/        # Image files
├── server.js              # Simple Node.js server
└── render.yaml            # Render deployment config
```

## Style Structure

The CSS is organized into sections:

1. Root Variables & Global Styles
2. Navigation Styles
3. Hero Section Styles
4. CTA Button Styles
5. Quality Content Section
6. Animation & Effects
7. Statistics Section
8. Testimonial Section
9. Services Section
10. Consulting CTA Section
11. Form Controls
12. Footer
13. Responsive Adjustments

## Features

- Modern, clean design with a focus on readability and user experience
- Responsive layout for all device sizes
- Optimized for SEO with meta tags, structured data, sitemap, and robots.txt
- Interactive elements including:
  - Animated statistics counters
  - Hover effects on service cards
  - Scroll-triggered animations in the Quality Content section
  - Video background with frame effect in the hero section
- Performance optimized with:
  - Preloaded critical resources
  - Optimized image assets
  - CSS and JS file organization

## JavaScript Features

- Navbar scroll effect (changes appearance on scroll)
- Smooth scrolling for navigation links
- Interactive quality content section with scroll-triggered animations
- Testimonials carousel for mobile views
- Counter animations that activate on scroll

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the server with `node server.js`
4. The site will be available at `http://localhost:3000`

## SEO Optimizations

- Comprehensive meta tags for search engines
- Open Graph and Twitter Card meta tags for social media sharing
- JSON-LD structured data for business information and FAQs
- XML sitemap and robots.txt for search engine crawling
- Semantic HTML elements with appropriate ARIA attributes for accessibility

## Black Frame Video Container

The video in the hero section features a sleek black frame. This is achieved by using the `::before` pseudo-element with a black background and a mask to create the frame effect.

## Notes on Code Structure

The project uses a component-based approach to structuring the HTML, CSS, and JavaScript. Each section of the website is self-contained, making it easier to maintain and update. The JavaScript is organized to initialize different features only when the corresponding elements exist in the DOM.

All styles have been separated from the HTML file and placed in the styles.css file for better organization and maintainability. 
