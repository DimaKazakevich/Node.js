/*
Разработайте серверное приложение 03-02, которое на GET-запрос вида  http://localhost:5000/fact?k=3 возвращает ответ, 
в теле которого содержится  сообщение в json-формате вида {k:3, fact:6}, 
где k – полученное в качестве параметра значение, а fact – значение факториала.      
Для расчета факториала используйте рекурсивный алгоритм. 
*/

let http = require('http');
let url = require('url');

function factorial(n){
    if(n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n-1);
    }
}

http.createServer(function(request, response) {
    let defaultValue = JSON.stringify({k:0, fact:1});
    if(url.parse(request.url).pathname === '/fact') {
        if(typeof url.parse(request.url, true).query.k !== undefined) {
            let numberInQuery = +url.parse(request.url, true).query.k;
            if(Number.isInteger(numberInQuery)) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({k:numberInQuery, fact: factorial(numberInQuery)}));
            }
        }
    } else {
        response.end(defaultValue);
    }
}).listen(8080);
