const isReviewer = (req, res, next) => {
  if(req.isReviewer){
    next();
  }else{
    res.redirect(`/reviewer_panel/login?msg=${encodeURIComponent('You are not logged in as Reviewer!')}`);
  }
}

module.exports = isReviewer;