/*
sd x	oстановить сервер через x секунд; ввод новой команды отменяет действие  предыдущей sd и устанавливает новый отсчет; 
ввод команды sd  без параметра отменяет остановку сервера.         

sc  x	запустить функцию периодической фиксации состояния БД; периодичность выполнения функции  commit задается в секундах параметром x; 
ввод команды sс  без параметра останавливает периодическое выполнение commit.        
 
ss x 	запустить функцию сбора статистики, которая работает x секунд и собирает за этот промежуток   статистику о количестве выполненных запросов и фиксаций БД; 
ввод команды ss  без параметра останавливает сбор статистики.     
*/

let http = require('http');
let url = require('url');
let fs = require('fs');
let data = require('./module');
const { clearInterval } = require('timers');

let db = new data.DB();

let amountOfRequests = 0;

db.on('GET', (request, response) => {
    console.log('DB.GET');
    amountOfRequests++;
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
    amountOfRequests++;
    req.on('data', data => {
        let reqData = JSON.parse(data);
        db.post(reqData);
        resp.end(JSON.stringify(reqData));
    })
})

db.on('DELETE', (req, resp) => {
    console.log('Db.DELETE');
    amountOfRequests++;
    let idToDelete = +url.parse(req.url, true).query.id;
    resp.end(JSON.stringify(db.delete(idToDelete)));
})

db.on('PUT', (req, resp) => {
    console.log('Db.PUT');
    amountOfRequests++;
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

let timerIdSdCommand = null;
let timerIdScCommand = null;
let timerIdSsCommand = null;
let amountOfCommits = 0;

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    let newArr = [];

    while((chunk = process.stdin.read()) != null) {
        newArr = chunk.trim().split(' ');
        if(newArr[0] === 'sd') {
            if(newArr.length === 2) {
                clearTimeout(timerIdSdCommand);
                console.log(`Server will be stopped in ${newArr[1]} sec.`);
                timerIdSdCommand = setTimeout(() => {
                    console.log('Server stopped.');
                    process.exit(0);
                }, newArr[1] * 1000);
            } else if(newArr.length === 1) {
                console.log('Server stop canceled.');
                clearTimeout(timerIdSdCommand);
            }
        }
        if(newArr[0] === 'sc') {
            if(newArr.length === 2) {
                timerIdScCommand =  setInterval(() => {
                        db.commit();
                        amountOfCommits++;
                    }, newArr[1] * 1000);
            } else if(newArr.length === 1) {
                console.log('Server auto commiting canceled.')
                clearInterval(timerIdScCommand);
            }
        }
        if(newArr[0] === 'ss') {
            if(newArr.length === 2) {
                timerIdSsCommand =  setTimeout(() => {
                        console.log(`Server started collecting statistics. Result will be in ${newArr[1]} sec.`);
                        console.log(`Amount of completed requests - ${amountOfRequests}`);
                        console.log(`Amount of completed requests - ${amountOfRequests}`);
                    }, newArr[1] * 1000);
            } else if(newArr.length === 1) {
                console.log('Server statistics collection has been stopped.')
                clearInterval(timerIdSsCommand);
            }
        }
    }
});