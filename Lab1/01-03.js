let http = require('http');
 
let getHeadersMarkupString= (request) => {
    let resultString = '';
    for(key in request.headers) {
        resultString += `<h3>${key}: ${request.headers[key]}</h3>`
    }

    return resultString;
};

http.createServer(function(request, response) {
    let body = '';
    request.on('data', str => { 
        body += str; 
        console.log('data', body); 
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    request.on('end', () => response.end('<!DOCTYPE html>' +
                 '<html>' +
                 '<head>' +
                 '</head>' +
                 '<body style="background-color:#1F2739; color:#A7A1AE;">' +
                    '<h1>Request structure</h1>' +
                    `<h2>Method: ${request.method}</h2>` +
                    `<h2>Uri: ${request.url}</h2>` +
                    `<h2>Http Verison: ${request.httpVersion}</h2>` +
                    '<h2>Headers</h2>' +
                    getHeadersMarkupString(request) +
                    `<h2>Body: ${body}</h2>` +
                 '</body>' +
                 '</html>'));
}).listen(8080);

