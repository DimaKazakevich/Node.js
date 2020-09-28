function Stat(defaultpath = './static') {
    this.STATIC_FOLDER = defaultpath;
    let fs = require('fs');

    this.isStatic = (ext, filename) => {
        let reg = new RegExp(`^\/.+\.${ext}$`);
        return reg.test(filename);
    }

    let pathStatic = (filename) => {
        return `${this.STATIC_FOLDER}${filename}`;
    }

    this.writeHTTP404 = (res) => {
        res.stausCode = 404;
        res.statusMessage = 'Resource not found';
        res.end('Resource not found');
    }

    let pipeFile = (req, res, headers) => {
        res.writeHead(200, headers);
        fs.createReadStream(pathStatic(req.url)).pipe(res);
  
    }

    this.sendFile = (req, res, headers) => {
        fs.access(pathStatic(req.url), fs.constants.R_OK, err => {
            if(err) {
                this.writeHTTP404(res);
            } else {
                pipeFile(req, res, headers);
            }
        })
    }
}

module.exports = (param) =>{return new Stat(param);};