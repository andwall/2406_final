/**
 * File: database.js
 * Purpose: responsible for initializing the database 
 */
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('data/fitness_tracker');
const crud = require('./crud');

/* Init database */
db.serialize(function(){

	/* Create tables */
	db.run(crud.CREATE_USER_TABLE);
	db.run(crud.CREATE_USER_EXERCISE_TABLE);

	/* Initial values */
	db.run(crud.CREATE_USER, ['andrew', 'andrew@mail.com', 'secret', 'user']);
	db.run(crud.CREATE_USER, ['frank', 'frank@mail.com', 'secret', 'user']);
	db.run(crud.CREATE_USER, ['admin', 'admin@mail.com', 'secret', 'admin']);

	db.run(crud.CREATE_USER_EXERCISE, [1, 'Bench Press', 3, '5,5,5', '2024-04-07']);
	db.run(crud.CREATE_USER_EXERCISE, [1, 'Incline Press', 3, '8,8,8', '2024-04-07']);
	db.run(crud.CREATE_USER_EXERCISE, [2, 'Squat', 3, '3,3,3', '2024-04-06']);
});

module.exports = db;