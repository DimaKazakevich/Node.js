const WebSocket = require('ws');
const wss = new WebSocket.Server({port:5000, host:'localhost'});

wss.on('connection', (ws) => {
    let parsedData;
    ws.on('message', (data) => {
        parsedData =  JSON.parse(data);
        console.log('on message: ', data);
    })

    let messageNumber = 0
    setInterval(()=> {
        ws.send(JSON.stringify({server: messageNumber++, client: parsedData.client, timestamp: new Date().toISOString()}))
    }, 5000);
})
wss.on('error', (e)=>{console.log('wss server error', e)})