const reviewedPaperRouter = require('express').Router();;
const { renderReviewedPaper, apiReviewedPaperList } = require('../../controllers/reviewer/reviewed_paper.controller');
const { renderWaitingForReview, apiWaitingForReviewList, apiSaveReview, apiSubmitReview } = require('../../controllers/reviewer/waiting_for_review.controller');

reviewedPaperRouter.get('', renderReviewedPaper);

/* @GET/@POST for api */
reviewedPaperRouter.get('/list', apiReviewedPaperList);
reviewedPaperRouter.post('/save_review', apiSaveReview);
reviewedPaperRouter.post('/submit_review', apiSubmitReview);

module.exports = reviewedPaperRouter;

