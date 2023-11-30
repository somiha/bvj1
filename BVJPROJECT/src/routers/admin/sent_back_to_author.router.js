const express = require('express');
const { renderSentBackToAuthor, sentBackPaperList } = require('../../controllers/admin/sent_back_to_authors.controller');
const sentBackToAuthorRouter = express.Router();

sentBackToAuthorRouter.get('', renderSentBackToAuthor);

sentBackToAuthorRouter.get('/list', sentBackPaperList);

module.exports = sentBackToAuthorRouter;

