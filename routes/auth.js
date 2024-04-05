const authChecker = (req, res, next) => {
  if(req.session.auth || req.path === '/auth'){
    next();
  }else{
    res.redirect('/login');
  }
}

module.exports = authChecker;