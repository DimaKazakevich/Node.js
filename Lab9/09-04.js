/*
10. Разработайте приложение (клиент) 09-04 предназначенное для оправки POST-запроса  
    с  данными в json-формате и обработки ответа в json-формате. 
11. Используйте структуры данных в запросах и ответах из задания 10 лабораторной работы 8.
12. Для проверки разработайте соответствующий  сервер.
13. Выведите на консоль: статус ответа, данные пересылаемые в теле ответа.
14.  Для проверки разработайте соответствующий  сервер.
 */

let http = require('http');

http.createServer(function(req, res) {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
        res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
        data = JSON.parse(data);
        let jsonResponse = {};
        jsonResponse.__comment = 'Response: ' + data.__comment;
        jsonResponse.x_plus_y = data.x + data.y;
        jsonResponse.Concatenation_s_o = data.s + ': ' + data.o.surname + ', ' + data.o.name;
        jsonResponse.Length_m = data.m.length;
        res.end(JSON.stringify(jsonResponse));
    });
}).listen(8080);


let parameters = JSON.stringify({
    __comment: "json",
    x: 1,
    y: 2,
    s: "message",
    m: [1, 2],
    o: {
    surname:"surname",
    name: "name"
    }
})

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'POST',
    headers: {
        'content-type':'application/json', 'accept':'application/json'
    }
}

let req = http.request(options, (res) => {
    console.log('status code:', res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk.toString('utf-8');
    });
    res.on('end', () => {
        console.log('body=', responseData);
        console.log('parsed body=', JSON.parse(responseData));
    });
});
req.end(parameters);