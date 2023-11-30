const express = require('express');
const { renderWaitingForReview, apiWaitingForReviewList, apiSaveReview, apiSubmitReview } = require('../../controllers/reviewer/waiting_for_review.controller');
const waitingForReviewRouter = express.Router();

waitingForReviewRouter.get('', renderWaitingForReview);

/* @GET/@POST for api */
waitingForReviewRouter.get('/list', apiWaitingForReviewList);
waitingForReviewRouter.post('/save_review', apiSaveReview);
waitingForReviewRouter.post('/submit_review', apiSubmitReview);

module.exports = waitingForReviewRouter;

