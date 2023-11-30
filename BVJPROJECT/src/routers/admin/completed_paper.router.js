const express = require('express');
const { renderCompletedPaper } = require('../../controllers/admin/completed_paper.controller');
const completedPaperRouter = express.Router();

completedPaperRouter.get('', renderCompletedPaper);

module.exports = completedPaperRouter;

