let http = require('http');

let state = 'norm';

http.createServer(function(request, response) {
    if(request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(`<h1>${state}</h1>`);
    }
}).listen(8080);

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while((chunk = process.stdin.read()) != null) {
        if(chunk.trim() === 'test' || chunk.trim() === 'norm' || chunk.trim() === 'stop' || chunk.trim() === 'idle') {
            process.stdout.write(`reg = ${state} --> ${chunk.trim()} \n`);
            state = chunk.trim();
            process.stdout.write(`${state}->`)
        }
        else if(chunk.trim() === 'exit') {
            process.exit(0);
        }
        else {
            process.stdout.write(`${state}->`);
        }
    }
});

