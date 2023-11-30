const isAuthorApi = (req, res, next) => {
  if(req.isAuthor){
    next();
  }else{
    res.status(403).json({ message: "Access denied!" });
  }
}

module.exports = isAuthorApi;