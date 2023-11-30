const express = require('express');
const { renderHome } = require('../controllers/index/index.controller');
const indexRouter = express.Router();

indexRouter.get('', renderHome);


module.exports = indexRouter;