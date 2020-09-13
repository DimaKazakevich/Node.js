let http = require('http');

http.createServer(function(request, response) {
    if(request.url === '/api/name') {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Dima Kazakevich');
    }
}).listen(8080);