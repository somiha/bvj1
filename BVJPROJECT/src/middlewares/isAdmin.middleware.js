const isAdmin = (req, res, next) => {
  if(req.isAdmin){
    next();
  }else{
    res.redirect(`/login?error=${encodeURIComponent('You are not logged in as Admin!')}`);
  }
}

module.exports = isAdmin;