const express = require('express');
const { renderArticles, renderArticlesInVolume, renderArticleById, renderEditorialById } = require('../controllers/articles/articles.controller');
const articlesRouter = express.Router();

articlesRouter.get('', renderArticles);
articlesRouter.get('/view_volume/:volume_id', renderArticlesInVolume);
articlesRouter.get('/view_paper/:paper_id', renderArticleById);
articlesRouter.get('/editorial/:editorial_id', renderEditorialById);


module.exports = articlesRouter;