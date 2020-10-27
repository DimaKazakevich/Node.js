/*
7. Разработайте приложение (клиент) 09-03 предназначенное для оправки POST-запроса 
   с параметрами  x, y, s.
8. Выведите на консоль: статус ответа, данные пересылаемые в теле ответа.
9. Для проверки разработайте соответствующий  сервер.
*/

let http = require('http');
let query = require('querystring');
let url = require('url');

http.createServer(function(request, response) {
    let parsedQuery = url.parse(request.url, true).query;
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(`<h1>x=${+parsedQuery.x}; y=${parsedQuery.y}; s=${parsedQuery.s}</h1>`);
}).listen(8080);

let parameters = query.stringify({x:3, y:5, s: 'Перемен требуют наши сердца!'});
let path = `/?${parameters}`;

let options = {
    host: 'localhost',
    path: path,
    port: 8080,
    method: 'POST'
}

let req = http.request(options, (res) => {
    console.log('status code:', res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
        console.log('body=', responseData += chunk.toString('utf-8'));
    });
});

req.write(parameters);

req.end();