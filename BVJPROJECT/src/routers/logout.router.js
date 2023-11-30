const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('', (req, res) => {
  res.clearCookie('usr_token');
  res.redirect('/');
})

module.exports = logoutRouter;