const USER_TABLE = 'users'

const CRUD = {
  CREATE_USER_TABLE: `CREATE TABLE IF NOT EXISTS ${USER_TABLE} (
    userid INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL, 
    role TEXT NOT NULL
  );`,
  CREATE_USER: `INSERT OR IGNORE INTO ${USER_TABLE} (name, email, password, role) VALUES (?, ?, ?, ?);`,
  GET_USER_BY_EMAIL: `SELECT * FROM ${USER_TABLE} WHERE email = ?;`
}

module.exports = CRUD;