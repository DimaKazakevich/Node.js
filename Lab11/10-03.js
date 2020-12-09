let n = 0;
const WebSocket = require('ws');
const wss = new WebSocket.Server({port:5000, host:'localhost'});
wss.on('connection', (ws) => {
    ws.on('ping', (mess) => {
        console.log('receive a ping : ' + mess);
    });

    setInterval(() => {
        ws.send('11-03 server ' + ++n + ' ');
    }, 15000);
})
wss.on('error', (e) => {
    console.log('wss server error', e)
})
