const fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

ws.on('open', () => {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readStream = fs.createReadStream(`./MyFile.txt`);
    readStream.pipe(duplex);
})