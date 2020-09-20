let util = require('util');
let events = require('events');

var db_data = [{id:'1', name:'Дима Казакевич', bday: '2000-06-17'},
               {id:'2', name:'Кирилл Болвако', bday: '2000-08-09'},
               {id:'3', name:'Даша Титовец', bday: '2001-06-26'},
               {id:'4', name:'Дима Федоров', bday: '2001-05-05'},
               {id:'5', name:'Максим Трифонов', bday: '2000-09-24'},
               {id:'6', name:'Миша Городилов', bday: '2000-03-18'},
               {id:'7', name:'Аня Костюкова', bday: '2000-05-29'}
              ]

function DB() {
    this.lastReqId;
    this.get = () => {
        return db_data.sort(function(a, b) {
            if (a.id !== b.id) {
                return a.id - b.id
            }
        });
    };

    this.post = (str) => {db_data.push(str);};

    this.delete = (id) => { 
        let strToDel = this.getById(id);
        db_data.splice(this.lastReqId, 1);

        return strToDel;
    };
    this.getById = (id) => {
        this.lastReqId = db_data.findIndex(x => x.id === `${id}`);
        return db_data[this.lastReqId];
    }
    this.update = (name, bday) => {
        let strToUpdate = db_data[this.lastReqId];
        strToUpdate.name = name;
        strToUpdate.bday = bday;

        return this.getById(this.lastReqId);
    }
    this.commit = () => {
        console.log('Commit changes.');
    }
}

util.inherits(DB, events.EventEmitter);

exports.DB = DB;
