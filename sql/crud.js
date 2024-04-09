/**
 * File: crud.js
 * Purpose: holds all the sql statements used
 */

const USER_TABLE = 'users';
const USER_EXERCISE_TABLE = 'user_exercise';

const CRUD = {
  CREATE_USER_TABLE: `CREATE TABLE IF NOT EXISTS ${USER_TABLE} (
    userid INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    role TEXT NOT NULL
  );`,
  CREATE_USER_EXERCISE_TABLE: `CREATE TABLE IF NOT EXISTS ${USER_EXERCISE_TABLE} (
    userid INTEGER REFERENCES users(userid) NOT NULL,
    name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps TEXT NOT NULL,
    date TEXT NOT NULL,
    PRIMARY KEY(userid, name, date)
  );`,

  CREATE_USER: `INSERT OR IGNORE INTO ${USER_TABLE} (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING *;`,
  GET_USER_BY_EMAIL: `SELECT * FROM ${USER_TABLE} WHERE email = ?;`,

  CREATE_USER_EXERCISE: `INSERT OR IGNORE INTO ${USER_EXERCISE_TABLE} (userid, name, sets, reps, date) VALUES (?, ?, ?, ?, ?);`,
  GET_USER_EXERCISES: `SELECT * FROM ${USER_EXERCISE_TABLE} WHERE userid = ? ORDER BY date DESC;`,
};

module.exports = CRUD;