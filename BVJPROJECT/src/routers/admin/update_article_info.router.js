const express = require('express');
const { renderUpdateArticleInfo } = require('../../controllers/admin/update_article_info.controller');
const updateArticleInfoRouter = express.Router();

updateArticleInfoRouter.get('', renderUpdateArticleInfo);

module.exports = updateArticleInfoRouter;

