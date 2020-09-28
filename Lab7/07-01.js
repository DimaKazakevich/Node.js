let http = require('http');

let writeHTTP405 = (res) => {
    res.stausCode = 405;
    res.statusMessage = 'Method Not Allowed';
    res.end('Method Not Allowed');
}

let stat = require('./m07-01')('./static');
let http_hundler = (req, res) => {
    if(req.method !== 'GET') {
        writeHTTP405(res);
    }

    if(stat.isStatic('html', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'text/html; charset=utf-8'});
    } else if(stat.isStatic('css', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'text/css; charset=utf-8'});
    } else if(stat.isStatic('js', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'text/javascript; charset=utf-8'});
    } else if(stat.isStatic('docx', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'application/msword'});
    } else if(stat.isStatic('mp4', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'video/mp4; charset=utf-8'});
    } else if(stat.isStatic('png', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'image/png; charset=utf-8'});
    } else if(stat.isStatic('json', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'application/json; charset=utf-8'});
    } else if(stat.isStatic('xml', req.url)) {
        stat.sendFile(req, res, {'Content-Type': 'application/xml; charset=utf-8'});
    }
}

let server = http.createServer();
server.listen(8080).on('request', http_hundler);