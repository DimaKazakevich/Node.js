let http = require('http');
let fs = require('fs');

http.createServer(function(request, response) {
    if(request.url === '/png') {
        let file = './grayLogo.png';
        fs.stat(file, (err, stat) => {
            if(err) {
                console.log('error: ', err);
            } else {
                let png = fs.readFileSync(file);
                response.writeHead(200, {'Content-Type': 'image/jpeg', 'Content-Length': stat.size});
                response.end(png, 'binary');
            }
        })
    }
}).listen(8080);