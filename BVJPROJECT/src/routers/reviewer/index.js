const reviewerRouter = require('express').Router();
const fs = require('fs');
const revLoginRouter = require('./login.router');
const requestForReviewRouter = require('./request_for_review.router');
const waitingForReviewRouter = require('./waiting_for_review.router');
const upload = require('../../config/multer.config');
const reviewedPaperRouter = require('./reviewed_paper.router');
const completedPaperRouterReviewer = require('./completed_paper.router');
const reviewerProfileRouter = require('./reviewer_profile.router');
const certRouter = require('./certificate.router');
const isReviewer = require('../../middlewares/isReviewer.middleware');

reviewerRouter.get('/', isReviewer, (req, res) => {
  res.redirect('/reviewer_panel/request_for_review');
});
reviewerRouter.use('/request_for_review', isReviewer, requestForReviewRouter);
reviewerRouter.use('/waiting_for_review', isReviewer, waitingForReviewRouter);
reviewerRouter.use('/reviewed_paper', isReviewer, reviewedPaperRouter);
reviewerRouter.use('/completed_paper', isReviewer, completedPaperRouterReviewer);
reviewerRouter.use('/profile', isReviewer, reviewerProfileRouter);
revLoginRouter.use('/certificate', isReviewer, certRouter);

reviewerRouter.use('/login', revLoginRouter);


reviewerRouter.post('/upload', isReviewer, upload.single('file'), uploadFile);
reviewerRouter.delete('/delete_file',  deleteUploadFile);



/* @POST to upload a single file and return the filename */
async function uploadFile(req, res){
  res.send({
    success: true,
    filename: req.file.filename
  })
}

async function deleteUploadFile(req, res){
  fs.unlink(`./public/uploads/papers/${req.body.filename}`, (err) => {
    if (err) {
      return res.send({
        success: false,
        message: "File not found"
      })
    } else {
      return res.send({
        success: true,
        message: "File deleted"
      })
    }
  })
}


module.exports = reviewerRouter;