const jwt = require('jsonwebtoken');
const { AUTHOR, ADMIN, REVIEWER } = require('../enums/userRole');

const isLogged = (req, res, next) => {
  const token = req.cookies.usr_token;
  const decode = token && jwt.decode(token);
  if(decode){
    req.isLogged = true;
    req.isAuthor = decode.role === AUTHOR;
    req.isAdmin = decode.role === ADMIN;
    req.isReviewer = decode.role === REVIEWER;
    req.decode_data = decode;
    next();
  }else{
    req.isLogged = false;
    req.isAuthor = false;
    req.isAdmin = false;

    next();
  }
}

module.exports = isLogged;