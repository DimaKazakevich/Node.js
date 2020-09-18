let http = require('http');
let url = require('url');
let fs = require('fs');

function factorial(n){
    if(n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n-1);
    }
}

http.createServer(function(request, response) {
    let defaultValue = JSON.stringify({k:0, fact:1});
    if(url.parse(request.url).pathname === '/fact') {
        if(typeof url.parse(request.url, true).query.k !== undefined) {
            let numberInQuery = +url.parse(request.url, true).query.k;
            if(Number.isInteger(numberInQuery)) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({k:numberInQuery, fact: factorial(numberInQuery)}));
            } else {
                let html = fs.readFileSync('fetch.html');
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(html);;
            }
        }
    } else {
        response.end(defaultValue);
    }
}).listen(8080);