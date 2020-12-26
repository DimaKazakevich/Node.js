const rpcWSC = WebSocket = require('rpc-websockets').Client;
let wsA = new rpcWSC('ws://localhost:8080');


wsA.on('open',()=>{
    wsA.subscribe('Changed');
    wsA.on('Changed', (file) =>
    {
        console.log(`File ${ file.file } was changed.`);
    });
});