let WebSocket = require('ws');

let ws = new WebSocket('ws://localhost:5000/broadcast')

ws.on('open', () => {
    let k = 0;
    setInterval(() => {
        ws.send(`client: ${++k}`)
    }, 2000)
    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    })
})