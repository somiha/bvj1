const express = require('express');
const { renderAddReviewer, doAddReviewer } = require('../../controllers/admin/add_reviewer.controller');
const addReviewerRouter = express.Router();

addReviewerRouter.get('', renderAddReviewer);
addReviewerRouter.post('', doAddReviewer);

module.exports = addReviewerRouter;

