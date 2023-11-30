const express = require('express');
const { renderPaperInRevision, paperInRevisionList } = require('../../controllers/admin/paper_in_revision.controller');
const paperInRevisionRouter = express.Router();

/* @RENDER views */
paperInRevisionRouter.get('', renderPaperInRevision);


/* @GET/@POST api routers */
paperInRevisionRouter.get('/list', paperInRevisionList);

module.exports = paperInRevisionRouter;

