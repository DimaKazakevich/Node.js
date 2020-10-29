/*
24. Разработайте приложение (клиент) 09-08 предназначенное для оправки GET-запроса и получения ответа с вложенным файлом.   
25. Для проверки разработайте соответствующий  сервер.
*/

let http = require('http');
let fs = require('fs');

this.sendFile = (req, res, headers) => {
    fs.access('./', fs.constants.R_OK, err => {
        pipeFile(req, res);
    })
}

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'multipart/form-data; charset=utf-8'});
    let filename = 'MyFile.jpg';
    fs.access(filename, fs.constants.R_OK, err => {
        let file = fs.createReadStream(filename);
        response.pipe(file);
    })
    response.end();
}).listen(8080);

let file = fs.createWriteStream('MyFile.jpg');

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'GET'
}

let req = http.request(options, (res) => {
    res.pipe(file);
});
req.end();