/**
 * File: authRouter.js
 * Purpose: responsible for handling authentication
 */
const express = require('express');
const router = express.Router();
const db = require('../sql/database');
const crud = require('../sql/crud')

router.route('/').get((req, res)=>{
  res.render('login');
})

/* Responsible for registering a new user or logging them in if they exist */
router.route('/register')
.post((req, res, next) => {
  const {name, email, password} = req.body;

  db.get(crud.GET_USER_BY_EMAIL, [email], (err, row) => {
    if (err) {
      return next(err);
    }
    if (row) { // User exists
      if (row.password == password) { // User logged in
        req.session.user = {name: row.name, email: row.email, role: row.role}
        req.session.isLoggedIn = true;
        return res.redirect('/home');
      } else { // Invalid login
        return res.redirect('/register');
      }
    } else { // User doesn't exist, so create them
      db.run(crud.CREATE_USER, [name, email, password, 'user'], (err) => {
        if (err) {
          return next(err);
        }
        req.session.isLoggedIn = true;
        req.session.user = {name: name, email: email, role: 'user'}
        return res.redirect('/home');
      });
    }
  });
});

/* Responsible for logging a user in or not if they don't exist */
router.route('/login')
.post((req, res, next) => {
  const { email, password } = req.body;

  db.get(crud.GET_USER_BY_EMAIL, [email], (err, row) => {
    if (err) {
      return next(err);
    }

    //invalid user or password
    if (!row || row.password !== password) { 
      return res.status(401).send('Invalid email or password.');
    }

    //valid user
    req.session.isLoggedIn = true;
    req.session.user = {name: row.name, email: row.email, role: row.role}
    res.redirect('/home');
  });
});

module.exports = router;