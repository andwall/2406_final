/**
 * File: userRouter.js
 * Purpose: responsible for handling user routes (e.g., creating new exercise)
 */
const express = require('express');
const crud = require('../sql/crud');
const router = express.Router();
const db = require('../sql/database');

router.route('/exercise')
.post((req, res) => {
  const {name, sets, reps, date } = req.body;

  db.get(crud.GET_USER_BY_EMAIL, [req.session.user.email], (err, row) => {
    if(err) res.status(500).send('There was an error creating your exercise')
    if(row){
      db.run(crud.CREATE_USER_EXERCISE, [row.userid, name, Number(sets), reps, date.toString()]);
    }else{
      res.status(500).send('There was an error creating your exercise')
    }
    res.redirect('/home');
  })
})

module.exports = router;