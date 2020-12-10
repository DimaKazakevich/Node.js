const rpcWSC = WebSocket = require('rpc-websockets').Client;
let wsA = new rpcWSC('ws://localhost:4000');


wsA.on('open',()=>{
    wsA.subscribe('A');
    wsA.on('A',()=>
    {
        console.log('Event A');
    });

    wsA.subscribe('B');
    wsA.on('B',()=>
    {
        console.log('Event B');
    });

    wsA.subscribe('C');
    wsA.on('C',()=>
    {
        console.log('Event C');
    });
});
