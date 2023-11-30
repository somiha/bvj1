const revLoginRouter = require('express').Router();

const { renderRevLoginPage, doRevLogin } = require('../../controllers/reviewer/login.controller');


revLoginRouter.get('/', renderRevLoginPage);
revLoginRouter.post('/', doRevLogin);

module.exports = revLoginRouter;