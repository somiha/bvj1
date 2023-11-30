const { renderReviewerProfile, doEditReviewerProfile, doChangeReviewerPass } = require('../../controllers/reviewer/reviewer_profile.controller');

const reviewerProfileRouter = require('express').Router();

reviewerProfileRouter.get('', renderReviewerProfile);
reviewerProfileRouter.post('', doEditReviewerProfile);
reviewerProfileRouter.post('/change_password', doChangeReviewerPass);

module.exports = reviewerProfileRouter;