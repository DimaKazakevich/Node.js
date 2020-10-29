/*
21. Создайте файл  MyFile.png  размером более 0.5 МБ.
22. Разработайте приложение (клиент) 09-07 предназначенное для оправки POST-запроса  с вложенным файлом  MyFile.png. 
23. Для проверки разработайте соответствующий  сервер.
 */

let http = require('http');
let fs = require('fs');
require('events').EventEmitter.prototype._maxListeners = 100;

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let jpg = '';
    request.on('data', (chunk) => {
    jpg += chunk.toString();
    request.on('end', () => {
        console.log('request.on(end) = ', jpg.length)
    });
}); 
}).listen(8080);

let bound = 'kdp-kdp-kdp';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.jpg"\r\n';
    body += 'Content-Type:application/octet-stream\r\n\r\n';

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'POST',
    headers: {
        'content-type':'multipart/form-data; boundary='+bound
    }
}

let req = http.request(options, (res) => {

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log('length of body = ', Buffer.byteLength(responseData));
    })
});
req.write(body);

let stream = new fs.ReadStream('MyFile.jpg');
stream.on('data', (chunk) => {
    req.write(chunk);
    console.log(Buffer.byteLength(chunk));
})
stream.on('end', () => {
    req.end(`\r\n--${bound}--\r\n`);
})