/*
1. Разработайте приложение (клиент) 09-01 предназначенное для оправки GET-запроса.
2. Выведите на консоль: статус ответа, сообщение к статусу ответа, IP-адрес удаленного сервера, порт удаленного сервера, 
   данные пересылаемые в теле ответа. 
3. Для проверки разработайте соответствующий  сервер.
 */
let http = require('http');

http.createServer(function(request, response) {
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('<h1>Hello</h1>');
    }
}).listen(8080);

let options = {
    host: 'localhost', 
    path: '/',
    port: 8080,
    method: 'GET'
}

let req = http.request(options, (res) => {
    console.log('status code:', res.statusCode);
    console.log('status message:', res.statusMessage);
    console.log('IP address of remote server:', res.socket.remoteAddress);
    console.log('Port of remote server:', res.socket.remotePort);

    let responseData = '';
    res.on('data', (chunk) => {
        console.log('body=', responseData += chunk.toString('utf-8'));
    });
})

req.end();
