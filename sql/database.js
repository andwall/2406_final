const url = require('url');
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('data/fitness_tracker');
const crud = require('./crud');

/* Init database */
db.serialize(function(){
	db.run(crud.CREATE_USER_TABLE);
	db.run(crud.CREATE_USER, ['andrew', 'andrew@mail.com', 'secret', 'user']);
	db.run(crud.CREATE_USER, ['frank', 'frank@mail.com', 'secret', 'user']);
	db.run(crud.CREATE_USER, ['admin', 'admin@mail.com', 'secret', 'admin']);
});

module.exports = db;