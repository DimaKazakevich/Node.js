let http = require('http');
let fs = require('fs');

http.createServer(function(request, response) {
    if(request.url === '/fetch') {
        let html = fs.readFileSync('fetch.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

    if(request.url === '/api/name') {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Dima Kazakevich');
    }
}).listen(8080);