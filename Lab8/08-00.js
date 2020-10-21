let http = require('http');
let url = require('url');

let server = http.createServer();

server.keepAliveTimeout = 10000;

let clientSocket = {};

let http_handler = (req, res) => {
    if(url.parse(req.url).pathname === '/connection') {
        if(!url.parse(req.url, true).query.set) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
        } else {
            server.keepAliveTimeout = +url.parse(req.url, true).query.set;
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>New value of KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
        }
    }

    if(url.parse(req.url).pathname === '/headers') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<h2>${JSON.stringify(req.headers)}</h2>`);
    }

    if(url.parse(req.url).pathname === '/parameter') {
        if((x = +url.parse(req.url, true).query.x) && (y = +url.parse(req.url, true).query.y)) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>Sum: ${x + y}</h2> \n <h2>Sub: ${x - y}</h2> \n <h2>Mult: ${x * y}</h2> \n <h2>Division: ${x / y}</h2>`);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>${url.parse(req.uri).pathname}</h2> \n <h2>Parameters is not number</h2>`);
        }
    }
    
    if(url.parse(req.url).pathname === '/close') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<h2>Server will be closed in 10 sec.</h2>`);
        setTimeout(()=> {
            server.close();
        }, 10000);
    }

    if(url.parse(req.url).pathname === '/socket') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<h2>localAddress: ${clientSocket.localAddress} \n localPort ${clientSocket.localPort}</h2>`);
    }
}

server.on('connection', (socket) => {
    clientSocket.localAddress = socket.localAddress;
    clientSocket.localPort = socket.localPort;
})

server.on('request', http_handler);

server.listen(7080);