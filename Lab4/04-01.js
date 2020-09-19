let http = require('http');
let url = require('url');
let fs = require('fs');
let data = require('./module');

let db = new data.DB();

db.on('GET', (request, response) => {
    console.log('DB.GET');
    if(typeof url.parse(request.url, true).query.id !== 'undefined') {
        let idToPut = +url.parse(request.url, true).query.id;
        console.log(JSON.stringify(db.getById(idToPut)));
        response.end(JSON.stringify(db.getById(idToPut)));
    } else {
        response.end(JSON.stringify(db.get()));
    }
})

db.on('POST', (req, resp) => {
    console.log('Db.POST');
    req.on('data', data => {
        let reqData = JSON.parse(data);
        db.post(reqData);
        resp.end(JSON.stringify(reqData));
    })
})

db.on('DELETE', (req, resp) => {
    console.log('Db.DELETE');
    let idToDelete = +url.parse(req.url, true).query.id;
    resp.end(JSON.stringify(db.delete(idToDelete)));
})

db.on('PUT', (req, resp) => {
    console.log('Db.PUT');
    req.on('data', data => {
        let reqData = JSON.parse(data);
        db.update(reqData.name, reqData.bday);
        resp.end(JSON.stringify(reqData));
    })
})

http.createServer(function(req, resp) {
    if(url.parse(req.url).pathname === '/') {
        let html = fs.readFileSync('index.html');
        resp.writeHead(200, {'Content-Type': 'text/html; charset = utf-8'});
        resp.end(html);
    } else if(url.parse(req.url).pathname === '/api/db') {
        db.emit(req.method, req, resp);
    }
}).listen(8080);