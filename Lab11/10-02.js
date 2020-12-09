const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port:5000, host:'localhost'});

let k = 0;
wss.on('connection', (ws) => {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readStream = fs.createReadStream(`./MyFile.txt`);
    readStream.pipe(duplex);
})