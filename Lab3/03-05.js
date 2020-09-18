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

function Factorial(n, callback) {
    this.number = n;
    this.fact = factorial;
    this.fcb = callback;
    this.calc = () => {setImmediate(() => {this.fcb(null, this.fact(this.number));})}
}

http.createServer(function(request, response) {
    let defaultValue = JSON.stringify({k:0, fact:1});
    if(url.parse(request.url).pathname === '/fact') {
        if(typeof url.parse(request.url, true).query.k !== undefined) {
            let numberInQuery = +url.parse(request.url, true).query.k;
            if(Number.isInteger(numberInQuery)) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                let fact = new Factorial(numberInQuery, (ee, result) => {response.end(JSON.stringify({k:numberInQuery, fact: result}));});
                fact.calc();
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