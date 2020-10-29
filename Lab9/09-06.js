/*
18. Создайте файл MyFile.txt. Добавьте в файл текст. 
19. Разработайте приложение (клиент) 09-06 предназначенное для оправки POST-запроса  с вложенным файлом  MyFile.txt.
20. Для проверки разработайте соответствующий  сервер.
 */

let http = require('http');
let fs = require('fs');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let txt = '';
    request.on('data', (chunk) => {
    txt += chunk.toString();
    response.end(txt);
}); 
}).listen(8080);

let bound = 'kdp-kdp-kdp';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type:text/plain\r\n\r\n';
    body += fs.readFileSync('MyFile.txt');
    body += `\r\n--${body}--\r\n`;

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
        console.log('data body=', responseData += chunk.toString('utf-8'));
    });
});
req.end(body);