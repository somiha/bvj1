const express = require('express');
const { renderRevised, revisedPaperList } = require('../../controllers/admin/revised_paper.controller');
const revisedPaperRouter = express.Router();

/* @RENDER views */
revisedPaperRouter.get('', renderRevised);


/* @GET/@POST api routers */
revisedPaperRouter.get('/list', revisedPaperList);

module.exports = revisedPaperRouter;

