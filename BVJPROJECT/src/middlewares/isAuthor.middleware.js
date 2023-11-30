const isAuthor = (req, res, next) => {
  if(req.isAuthor){
    next();
  }else{
    res.redirect(`/login?msg=${encodeURIComponent('You are not logged in as Author!')}`);
  }
}

module.exports = isAuthor;