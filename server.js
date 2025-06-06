import http from 'http';
import fs from 'fs';
import path from 'path';

const server = http.createServer((req, res) => {
    let filePath = './src' + (req.url === '/' ? '/index.html' : req.url);
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end('Error loading ' + filePath);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8000, () => {
    console.log('Server running at http://localhost:8000/');
});