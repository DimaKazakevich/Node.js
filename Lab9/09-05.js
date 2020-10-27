/*
15. Разработайте приложение (клиент) 09-05 предназначенное для оправки POST-запроса  
с  данными в xml-формате и обработки ответа в xml-формате. 
16. Используйте структуры данных в запросах и ответах из задания 11 лабораторной работы 8.
17. Для проверки разработайте соответствующий  сервер.
 */

let http = require('http');
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');


http.createServer(function(req, res) {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
        res.writeHead(200, {'Content-type': 'text/xml'});
        parseString(data, function(err, result) {
            let id = result.request.$.id;
            let xSum = 0;
            let mSum = '';
            result.request.x.forEach((p) => {
                xSum += parseInt(p.$.value);
            });
            result.request.m.forEach((p) => {
                mSum += p.$.value;
            });

            let xmlDoc = xmlbuilder.create('response').att('id', '33').att('request', id);
            xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up().ele('concat').att('element', 'm').att('result', mSum);

            res.end(xmlDoc.toString());
        });
    });
}).listen(8080);

let parameters = xmlbuilder.create('request').att('id', '28');
parameters.ele('x').att('value', '1').up()
          .ele('x').att('value', '2').up()
          .ele('m').att('value', 'a').up()
          .ele('m').att('value', 'b').up()
          .ele('m').att('value', 'c').up()

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'POST',
    headers: {
        'content-type':'text/xml', 'accept':'text/xml'
    }
}

let req = http.request(options, (res) => {
    console.log('status code:', res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log('body=', responseData);
        // parseString(responseData, (err, str) => {
        //     if(err) {
        //         console.log('xml parser error');
        //     } else {
        //         console.log('str = ', str);
        //         console.log('str.result = ', str.result);
        //     }
        // });
    });
});
req.end(parameters.toString({pretty:true}));