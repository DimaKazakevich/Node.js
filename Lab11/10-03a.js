/*
let ws = require('ws');
let wsClient1 = createClient('1');
let wsClient2 = createClient('2');

function createClient(clientId) {
    let client = new ws('ws://localhost:'+3000);
    client.clientId = clientId;
    client.on('ping', (mess) => {
        console.log(this.clientId + ' receive a ping : ' + mess);
    });
    client.on('message', (mess) => {
        console.log(this.clientId + ' receive a message : ' + mess);
    });
    client.on('close', () => {
        console.log(this.clientId + ' closed');
    });

    const duplex = ws.createWebSocketStream(client, {encoding: 'utf8'});
    duplex.pipe(process.stdout);
    process.stdin.pipe(duplex);
    return client;
}

function closeClient(client) {
    console.log('close ' + client.clientId); client.close();
}

//setTimeout(function(){ closeClient(wsClient1); closeClient(wsClient2); wsServer.close(); },2500);*/

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8'});

duplex.pipe(process.stdout) // сообщение от сервера --> stdout

process.stdin.pipe(duplex) // stdin --> сообщение серверу

ws.on('pong', (data) => {
    console.log('on pong: ', data.toString());
})

setInterval(() => {
    console.log('server: ping');
    ws.ping('client ping')
}, 5000)
