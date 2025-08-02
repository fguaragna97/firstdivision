const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3002;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.webp': 'image/webp'
};

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  '.html': 300, // 5 minutes for HTML
  '.css': 31536000, // 1 year for CSS
  '.js': 31536000, // 1 year for JS
  '.png': 31536000, // 1 year for images
  '.jpg': 31536000,
  '.jpeg': 31536000,
  '.gif': 31536000,
  '.svg': 31536000,
  '.webp': 31536000,
  '.mp4': 31536000, // 1 year for videos
  '.webm': 31536000,
  '.woff': 31536000, // 1 year for fonts
  '.woff2': 31536000,
  '.ttf': 31536000
};

function shouldCompress(contentType) {
  return contentType.startsWith('text/') || 
         contentType.includes('javascript') || 
         contentType.includes('json') ||
         contentType.includes('svg');
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

const server = http.createServer((req, res) => {
  // Handle favicon.ico requests
  if (req.url === '/favicon.ico') {
    res.statusCode = 204;
    res.end();
    return;
  }

  console.log(`${req.method} ${req.url}`);
  
  // Normalize URL path
  let filePath = 'public' + req.url;
  if (filePath === 'public/') {
    filePath = 'public/index.html';
  }

  // Get file extension
  const extname = path.extname(filePath).toLowerCase();
  
  // Default content type is text/plain
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile('public/index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error: ' + err.code);
          } else {
            // Set headers for HTML fallback
            setSecurityHeaders(res);
            res.writeHead(200, { 
              'Content-Type': 'text/html',
              'Cache-Control': `public, max-age=${CACHE_DURATIONS['.html']}`
            });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end('Error: ' + err.code);
      }
    } else {
      // Success - set security headers
      setSecurityHeaders(res);
      
      // Set cache headers
      const cacheMaxAge = CACHE_DURATIONS[extname] || 300;
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${cacheMaxAge}`
      };

      // Add immutable cache for assets with long cache times
      if (cacheMaxAge > 86400) { // More than 1 day
        headers['Cache-Control'] += ', immutable';
      }

      // Check if client accepts gzip compression
      const acceptsGzip = req.headers['accept-encoding'] && 
                         req.headers['accept-encoding'].includes('gzip');
      
      if (acceptsGzip && shouldCompress(contentType)) {
        headers['Content-Encoding'] = 'gzip';
        headers['Vary'] = 'Accept-Encoding';
        
        zlib.gzip(content, (err, compressed) => {
          if (err) {
            res.writeHead(500);
            res.end('Compression error');
          } else {
            res.writeHead(200, headers);
            res.end(compressed);
          }
        });
      } else {
        res.writeHead(200, headers);
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Optimizations enabled: compression, caching, security headers');
}); 
