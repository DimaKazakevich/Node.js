const nodemailer = require("nodemailer");
let http = require('http');
let fs = require('fs');

function send(to, message) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
      user: 'uniteddirectonlinestore@gmail.com',
      pass: 'UDS2077563', 
    },
  });

  let info = transporter.sendMail({
    from: 'uniteddirectonlinestore@gmail.com',
    to: to,
    text: message, 
    html: `<b>${message}</b>`, 
  });
}

http.createServer(function(request, response) {
    if(request.method === 'POST') {
        request.on('data', data => {
            let reqData = JSON.parse(data);
            console.log(reqData.to);
            console.log(reqData.message);
            send(reqData.to, reqData.message);
        })
        response.end();
    } else if(request.method === 'GET') {
        let html = fs.readFileSync('index.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
}).listen(8080);