/*
24. Разработайте приложение (клиент) 09-08 предназначенное для оправки GET-запроса и получения ответа с вложенным файлом.   
25. Для проверки разработайте соответствующий  сервер.
*/

let http = require('http');
let fs = require('fs');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let readableStream = fs.createReadStream('MyFile.txt');
    readableStream.on('end', () => {
        response.end();
    })

    readableStream.pipe(response);
    
}).listen(8080);

let writeableStream = fs.createWriteStream('MyFile2.txt');

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'GET'
}

let req = http.request(options, (res) => {
    res.pipe(writeableStream);
});
req.end();