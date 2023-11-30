const express = require('express');
const { renderLogin, doLogin, renderForgotPass, searchEmail, sendEmail, renderResetPass, doResetPass } = require('../controllers/login/login.controller');
const loginRouter = express.Router();

/* @GET for render routers */
loginRouter.get('', renderLogin);
loginRouter.get('/forgot-password', renderForgotPass);
loginRouter.get('/reset-password', renderResetPass);


/* @GET/@POST for api */
loginRouter.post('', doLogin);
loginRouter.post('/reset-password', doResetPass);
loginRouter.post('/forgot-password', searchEmail);
loginRouter.post('/recovery-mail', sendEmail);


module.exports = loginRouter;