const express = require('express');
const { renderUpdateReviewer } = require('../../controllers/admin/update_reviewer.controller');
const updateReviewerRouter = express.Router();

updateReviewerRouter.get('', renderUpdateReviewer);

module.exports = updateReviewerRouter;

