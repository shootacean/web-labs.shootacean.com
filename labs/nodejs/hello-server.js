const http = require('http');

const host = '127.0.0.1';
const port = 8080

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    res.end('Hello, World');
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
