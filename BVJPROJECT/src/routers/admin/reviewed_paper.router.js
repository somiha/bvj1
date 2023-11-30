const express = require('express');
const { renderReviewedPaper, reviewedPaperList, sendBackToAuthor } = require('../../controllers/admin/reviewed_paper.controller');
const reviewedPaperRouter = express.Router();

reviewedPaperRouter.get('', renderReviewedPaper);

reviewedPaperRouter.get('/list', reviewedPaperList);
reviewedPaperRouter.post('/send_back_to_author', sendBackToAuthor);

module.exports = reviewedPaperRouter;

