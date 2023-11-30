const express = require('express');
const { renderRequestForReview, apiRqForReviewList, apiAcptRqForReview } = require('../../controllers/reviewer/request_for_review.controller');
const requestForReviewRouter = express.Router();

requestForReviewRouter.get('', renderRequestForReview);



/* @GET/@POST for api */
requestForReviewRouter.get('/list', apiRqForReviewList);
requestForReviewRouter.post('/accept', apiAcptRqForReview);

module.exports = requestForReviewRouter;

