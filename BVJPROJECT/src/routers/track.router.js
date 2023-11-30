const express = require('express');
const { renderTrack, renderNeedRevision, needRevisionPaperList, renderUploadUpdatedFile, doUpdatedUploadFile, renderRevisionInProcess, revisonBeingProcessedPaperList, renderSubmittedPapers, submittedPaperList, renderSubmissionProcessed, submissionBeingProcessedList, completedPapersAuthorList, renderCompletedPaperAuthor, renderRejectedPaperAuthor, rejectedPapersAuthorList } = require('../controllers/track/track.controller');
const isAuthor = require('../middlewares/isAuthor.middleware');
const upload = require('../config/multer.config');
const trackRouter = express.Router();

trackRouter.get('',isAuthor, renderTrack);
trackRouter.get('/submitted_papers',isAuthor, renderSubmittedPapers);
trackRouter.get('/submission_being_processed',isAuthor, renderSubmissionProcessed);
trackRouter.get('/need_revision',isAuthor, renderNeedRevision);
trackRouter.get('/need_revision/upload/:paper_id',isAuthor, renderUploadUpdatedFile);
trackRouter.post('/need_revision/upload/:paper_id',isAuthor, upload.single('file_url'), doUpdatedUploadFile);
trackRouter.get('/revision_in_process',isAuthor, renderRevisionInProcess);
trackRouter.get('/completed_paper',isAuthor, renderCompletedPaperAuthor);
trackRouter.get('/rejected_paper',isAuthor, renderRejectedPaperAuthor);


/* @GET/@POST for api */
trackRouter.get('/need_revision/list',isAuthor, needRevisionPaperList);
trackRouter.get('/revision_in_process/list',isAuthor, revisonBeingProcessedPaperList);
trackRouter.get('/submitted_papers/list',isAuthor, submittedPaperList);
trackRouter.get('/submission_being_processed/list',isAuthor, submissionBeingProcessedList);
trackRouter.get('/completed_paper/list',isAuthor, completedPapersAuthorList);
trackRouter.get('/rejected_paper/list',isAuthor, rejectedPapersAuthorList);




module.exports = trackRouter;