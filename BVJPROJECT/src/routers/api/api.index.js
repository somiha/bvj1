const upload = require('../../config/multer.config');
const isAdminApi = require('../../middlewares/isAdminApi');
const isAuthorApi = require('../../middlewares/isAuthorApi');
const { apiDoUpdateReviewer, 
        apiSearchReviewer, 
        apiReviewerList, 
        apiAssignReviewer,
        apiSearchPaper,
        apiAddVolume,
        apiVolumeList,
        apiMovePosition,
        apiEditVolume,
        apiDeleteVolume,
        apiAuthorSearch,
        apiPaperCompleted,
        apiUpdateArticleAuthor,
        apiUpdateArticlePaperInfo,
        apiAuthorSearchAndUpdate,
        apiUploadFile,
        apiGetReview,
        apiAuthorDeletePaper,
        apiAdminDeletePaper,
        apiAdminRejectPaper,
        apiDeleteAuthor,
        apiSearchAuthor
      } = require('./api.controller');

const apiRouter = require('express').Router();

apiRouter.post('/update_reviewer/:id', isAdminApi, apiDoUpdateReviewer);
apiRouter.get('/search_reviewer', isAdminApi, apiSearchReviewer);
apiRouter.get('/reviewer_list', isAdminApi, apiReviewerList);
apiRouter.post('/assign_reviewer', isAdminApi, apiAssignReviewer);
apiRouter.get('/search_paper', isAdminApi, apiSearchPaper);
apiRouter.get('/search_author', isAdminApi, apiSearchAuthor);
apiRouter.post('/add_volume', isAdminApi, apiAddVolume);
apiRouter.get('/volume_list', isAdminApi, apiVolumeList);
apiRouter.put('/volume_list', isAdminApi, apiMovePosition);
apiRouter.delete('/volume_list/:id', isAdminApi, apiDeleteVolume);
apiRouter.post('/edit_volume', isAdminApi, apiEditVolume);
/* Update Article info from Amdin panel */
apiRouter.post('/update_article/author', isAdminApi, apiUpdateArticleAuthor);
apiRouter.post('/update_article/paper_info', isAdminApi, apiUpdateArticlePaperInfo);
apiRouter.get('/update_article/author/search', isAdminApi, apiAuthorSearchAndUpdate);
apiRouter.post('/update_article/file/:paper_id', isAdminApi, upload.single('file_url'), apiUploadFile);


/* Author API */
apiRouter.get('/author/search', isAuthorApi, apiAuthorSearch);
apiRouter.delete('/author/paper/delete', isAuthorApi, apiAuthorDeletePaper);
apiRouter.get('/paper/completed', isAdminApi, apiPaperCompleted);

/* Admin API */
apiRouter.delete('/admin/paper/delete', isAdminApi, apiAdminDeletePaper);
apiRouter.post('/admin/paper/reject', isAdminApi, apiAdminRejectPaper);
apiRouter.delete('/paper/delete_author', isAdminApi, apiDeleteAuthor);




/* For Reviewer, Author and Admin API */
apiRouter.get('/review/:paper_id', apiGetReview);

module.exports = apiRouter;