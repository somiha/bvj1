const express = require('express');
const { renderIndexing } = require('../controllers/indexing/indexing.controller');
const indexingRouter = express.Router();

indexingRouter.get('', renderIndexing);


module.exports = indexingRouter;