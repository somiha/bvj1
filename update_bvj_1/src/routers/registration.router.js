const express = require('express');
const { renderRegister, doRegister } = require('../controllers/register/register.controller');
const registrationRouter = express.Router();

registrationRouter.get('', renderRegister);
registrationRouter.post('', doRegister);


module.exports = registrationRouter;