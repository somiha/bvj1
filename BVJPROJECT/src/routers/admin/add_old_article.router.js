const express = require('express');
const { renderAddOldArticle, doAddOldArticle, renderAddAuthorAdmin, doAddAuthorAdmin, apiDoAddAuthorAdmin, apiDeleteAuthorAdmin, renderUploadFileAdmin, doUploadFileAdmin } = require('../../controllers/admin/add_old_article.controller');
const upload = require('../../config/multer.config');
const addOldArticleRouter = express.Router();

/* @API */
addOldArticleRouter.post('/api/add-author', apiDoAddAuthorAdmin);
addOldArticleRouter.post('/api/delete-author', apiDeleteAuthorAdmin);

/* @BROWSER */

addOldArticleRouter.get('', renderAddOldArticle);
addOldArticleRouter.post('', doAddOldArticle);
addOldArticleRouter.get('/:paper_id/add-author', renderAddAuthorAdmin);
addOldArticleRouter.post('/:paper_id/add-author', doAddAuthorAdmin);
addOldArticleRouter.get('/:paper_id/upload-file', renderUploadFileAdmin);
addOldArticleRouter.post('/:paper_id/upload-file', upload.single('file_url'), doUploadFileAdmin);



module.exports = addOldArticleRouter;

