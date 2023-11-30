const express = require('express');
const { renderWaitingForReview, waitingForReviewList } = require('../../controllers/admin/waiting_for_review.controller');
const waitingForReviewRouter = express.Router();

waitingForReviewRouter.get('', renderWaitingForReview);

/* @GET/@POST for api */
waitingForReviewRouter.get('/list', waitingForReviewList);

module.exports = waitingForReviewRouter;

