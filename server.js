const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const PUBLIC_DIR = path.join(__dirname, 'public');

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
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle favicon.ico request
  if (req.url === '/favicon.ico') {
    const faviconPath = path.join(PUBLIC_DIR, 'favicon.svg');
    try {
      const icon = fs.readFileSync(faviconPath);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.writeHead(200);
      res.end(icon);
      return;
    } catch (e) {
      res.writeHead(404);
      res.end();
      return;
    }
  }
  
  // Default to index.html for root path
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Make sure we're not going outside the public directory (security)
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end(`File not found: ${req.url}`);
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.setHeader('Content-Type', contentType);
      res.writeHead(200);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${PUBLIC_DIR}`);
}); 
