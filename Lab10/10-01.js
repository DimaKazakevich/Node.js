let http = require('http');
let fs = require('fs');


let httpServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/start') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync('10-01.html'));
    } else {
        res.stausCode = 400;
        res.statusMessage = 'Bad Request';
        res.end('Bad Request');
    }
})
httpServer.listen(3000);

let k = 0;
let WebSocket = require('ws');
let wsServer = new WebSocket.Server({port: 4000, host:'localhost', path:'/wsserver'})
wsServer.on('connection', (ws) => {
    let clientK = 0;
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
        clientK = message.toString().substring(14, 15);
    })
    setInterval(() => {
        ws.send(`10-01-server: ${clientK}->${++k}`)
    }, 5000)
})