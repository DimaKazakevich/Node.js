let http = require('http');
let url = require('url');
const fs = require('fs');

let pathToStudentFile = 'StudentList.json';

let notFoundError = (student_id) => {
    return JSON.stringify({"error": 2, "message": `student with id equals ${student_id} not found`})
}

let studentAlreadyExistError = (student_id) => {
    return JSON.stringify({"error": 3, "message": `student with id equals ${student_id} is exist`})
}

let getStudents = (full_path) =>{
    let student = JSON.parse(fs.readFileSync(full_path, 'utf8'));
    return student;
}

let createResponse = (response, responseData = undefined) => {
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    if (responseData) {
        response.end(JSON.stringify(responseData));
    } else {
        response.end();
    }
}

let GET_handler = (request, response) => {
    let requestPath = url.parse(request.url).pathname;
    switch (requestPath) {
        case '/': {
            createResponse(response, getStudents(pathToStudentFile))
            break;
        }
        case '/backup': {
            let backups = [];
            fs.readdir('./', function(err, items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].includes('_StudentList.json')) {
                        backups.push({file:items[i]});
                    }
                }
            });
            setTimeout(() => {
                createResponse(response, backups);
            },100)
            break;
        }
        default: {
            let student_id = requestPath.slice(1);
            let students = getStudents(pathToStudentFile)
            let foundStudent = students.find(x => x.id === +student_id);
            if (foundStudent === undefined) {
                createResponse(response, notFoundError(student_id));
            }
            createResponse(response, foundStudent);
            break;
        }
    }
}

let POST_handler = (request, response) => {
    let requestPath = url.parse(request.url).pathname;
    switch (requestPath) {
        case '/': {
            let data = '';
            request.on('data', chunk => {
                data += chunk;
            })
            request.on('end', () => {
                data = JSON.parse(data);
                let students = getStudents(pathToStudentFile);
                if (students.find(x => x.id === +data.id)) {
                    createResponse(response, studentAlreadyExistError(data.id))
                } else {
                    students.push(data);
                    fs.writeFileSync(pathToStudentFile, JSON.stringify(students));
                    createResponse(response, data);
                }
            })
            break;
        }
        case '/backup': {
            setTimeout(() => {
                let currentDate = new Date();
                let date = addZero(currentDate.getFullYear()) + addZero(currentDate.getMonth()+1) +
                    addZero(currentDate.getDate()) + addZero(currentDate.getHours()) +
                    addZero(currentDate.getMinutes()) + addZero(currentDate.getSeconds());

                function addZero(n) {
                    return (n < 10 ? '0' : '') + n;
                }

                fs.copyFile(pathToStudentFile, date + `_StudentList.json`, (err) => {
                    console.log(err)
                })
            }, 2000)
            createResponse(response)
        }
    }
}

let PUT_handler = (request, response) => {
    let requestPath = url.parse(request.url).pathname;
    switch (requestPath) {
        case '/': {
            let data = '';
            request.on('data', chunk => {
                data += chunk;
            })
            request.on('end', () => {
                data = JSON.parse(data);
                let students = getStudents(pathToStudentFile);
                let student = students.find(x => x.id === +data.id);
                if (student) {
                    student.id = data.id;
                    student.name = data.name;
                    student.bday = data.bday;
                    student.specility = data.specility;

                    fs.writeFileSync(pathToStudentFile, JSON.stringify(students));

                    createResponse(response, student);
                } else {
                    createResponse(response, notFoundError(data.id));
                }
            })
            break;
        }
    }
}

let DELETE_handler = (request, response) => {
    let requestPath = url.parse(request.url).pathname;
    if (requestPath.match('\\/backup\\/\\d{8}')) {
        let dateFromURL = requestPath.slice(8);
        let backups = [];
        fs.readdir('./', function(err, items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].includes('_StudentList.json')) {
                    backups.push({ file:items[i] });
                }
            }
        });

        setTimeout(() => {
            backups = backups.filter(x => +x.file.slice(0, 8) > +dateFromURL);
            backups.forEach(x => fs.unlink(x.file, (e) => {
                console.log(e)
            }));
        },100)
        createResponse(response, backups);
    } else {
        let student_id = requestPath.slice(1);
        let students = getStudents(pathToStudentFile);
        let foundStudent = students.find(x => x.id === +student_id);
        if (foundStudent === undefined) {
            createResponse(response, notFoundError(student_id))
        } else {
            const index = students.indexOf(foundStudent);
            students.splice(index, 1)
            fs.writeFileSync(pathToStudentFile, JSON.stringify(students));
            createResponse(response, foundStudent);
        }
    }
}

http.createServer(function(request, response) {
    switch (request.method) {
        case 'GET':
            GET_handler(request, response);
            break;
        case 'POST':
            POST_handler(request, response);
            break;
        case 'PUT':
            PUT_handler(request, response);
            break;
        case 'DELETE':
            DELETE_handler(request, response);
            break;
        default:
            break;
    }
}).listen(8080);

const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port:8080, host:"localhost"});
server.event('Changed');

fs.watch('./', (event, file) => {
    if (file && file.includes('_StudentList.json')) {
        server.emit('Changed', { file });
    }
})


