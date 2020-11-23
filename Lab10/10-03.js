let WebSocket = require('ws');

let wsServer = new WebSocket.Server({port:5000, host:'localhost', path:'/broadcast'})

wsServer.on('connection', (ws) => {
    ws.on('message', (data) => {
        wsServer.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN) {
                client.send(`server: ${data}`);
            }
        })
    })
})