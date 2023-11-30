const express = require('express');
const { renderReturnedPaper, returnedPaperList } = require('../../controllers/admin/returned_paper.controller');
const returnedPaperRouter = express.Router();

returnedPaperRouter.get('', renderReturnedPaper);

returnedPaperRouter.get('/list', returnedPaperList);

module.exports = returnedPaperRouter;

