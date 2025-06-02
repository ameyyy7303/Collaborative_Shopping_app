const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/hello') {
    res.end('Hello Amey!');
  } else {
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
