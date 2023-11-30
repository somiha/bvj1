const express = require('express');
const { renderSubmit, doSubmit, renderAddAuthor, doAddAuthor, renderUploadFile, doUploadFile, apiDoAddAuthor, apiDeleteAuthor } = require('../controllers/submit/submit.controller');
const isAuthor = require('../middlewares/isAuthor.middleware');
const upload = require('../config/multer.config');
const submitRouter = express.Router();

submitRouter.get('', isAuthor, renderSubmit);
submitRouter.post('', isAuthor, doSubmit);
submitRouter.get('/:paper_id/add-author', isAuthor, renderAddAuthor);
submitRouter.post('/:paper_id/add-author', isAuthor, doAddAuthor);
submitRouter.get('/:paper_id/upload-file', isAuthor, renderUploadFile);
submitRouter.post('/:paper_id/upload-file', isAuthor, upload.single('file_url'), doUploadFile);


/* @GET/@POST for api */
submitRouter.post('/add-author', isAuthor, apiDoAddAuthor);
submitRouter.post('/delete-author', isAuthor, apiDeleteAuthor);

module.exports = submitRouter;