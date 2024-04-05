const express = require('express');
const router = express.Router();
// const bcrypt = rquire('bcrypt');

router.route('/').get((req, res)=>{
  res.render('login')
})

router.route('/register')
.post((req, res) => {
  console.log('in post')
  console.log(req.body);
  req.session.auth = true;
  console.log(req.session)
  res.render('songs')
});

router.route('/login')
.post((req, res) => {

})


module.exports = router;