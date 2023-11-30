const express = require('express');
const { renderRecentSubmissions, paperList } = require('../../controllers/admin/recent_submissions.controller');
const recentSubmissionsRouter = express.Router();

/* @RENDER views */
recentSubmissionsRouter.get('', renderRecentSubmissions);


/* @GET/@POST api routers */
recentSubmissionsRouter.get('/paper_list', paperList);

module.exports = recentSubmissionsRouter;

