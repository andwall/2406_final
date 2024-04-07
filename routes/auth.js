const authChecker = (req, res, next) => {
  if(req.session.isLoggedIn || req.path === '/auth'){
    next();
  }else{
    res.redirect('/login');
  }
}

const adminAuthChecker = (req, res, next) => {
  console.log(req.session)
  if(req.session.isLoggedIn || req.path === '/auth'){
    if(req.session.user){
      if(req.session.user.role === 'admin'){
        next();
        return;
      }
    }
  }
  res.redirect('/home');
}

module.exports = {authChecker, adminAuthChecker};