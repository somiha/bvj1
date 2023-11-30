const reviewerRouter = require("express").Router();
const fs = require("fs");
const revLoginRouter = require("./login.router");
const requestForReviewRouter = require("./request_for_review.router");
const waitingForReviewRouter = require("./waiting_for_review.router");
const upload = require("../../config/multer.config");
const reviewedPaperRouter = require("./reviewed_paper.router");
const completedPaperRouterReviewer = require("./completed_paper.router");
const reviewerProfileRouter = require("./reviewer_profile.router");
const certRouter = require("./certificate.router");
const { REJECTED } = require("../../enums/paperCheckpoints");
const { createUpdateDelete } = require("../../helper/PromiseModule");
const isReviewer = require("../../middlewares/isReviewer.middleware");
const { log } = require("console");

reviewerRouter.get("/", isReviewer, (req, res) => {
  res.redirect("/reviewer_panel/request_for_review");
});
reviewerRouter.use("/request_for_review", isReviewer, requestForReviewRouter);
reviewerRouter.use("/waiting_for_review", isReviewer, waitingForReviewRouter);
reviewerRouter.use("/reviewed_paper", isReviewer, reviewedPaperRouter);
reviewerRouter.use(
  "/completed_paper",
  isReviewer,
  completedPaperRouterReviewer
);
reviewerRouter.use("/profile", isReviewer, reviewerProfileRouter);
revLoginRouter.use("/certificate", isReviewer, certRouter);

reviewerRouter.use("/login", revLoginRouter);

reviewerRouter.post("/upload", isReviewer, upload.single("file"), uploadFile);
reviewerRouter.post("/paper/reject", isReviewer, apiRejectPaper);
reviewerRouter.delete("/delete_file", deleteUploadFile);

/* @POST to upload a single file and return the filename */
async function uploadFile(req, res) {
  res.send({
    success: true,
    filename: req.file.filename,
  });
}

async function deleteUploadFile(req, res) {
  fs.unlink(`./public/uploads/papers/${req.body.filename}`, (err) => {
    if (err) {
      return res.send({
        success: false,
        message: "File not found",
      });
    } else {
      return res.send({
        success: true,
        message: "File deleted",
      });
    }
  });
}

// async function apiRejectPaper(req, res) {
//   try {
//     const { paper_id } = req.body;
//     console.log({ paper_id });
//     const update_query = `UPDATE paper_info SET checkpoint = ${REJECTED} WHERE id = ${paper_id}`;
//     console.log(update_query);
//     await createUpdateDelete(update_query);
//     res.json({
//       success: true,
//       message: "Paper deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// }

async function apiRejectPaper(req, res) {
  try {
    const { paper_id } = req.body;
    // const select_query = `SELECT file_url FROM paper_file WHERE paper_id = ${paper_id}`;
    // const file_url = await readData(select_query);
    // await deleteUploadedFile(file_url[0].file_url);
    const query = `DELETE FROM paper_reviewer WHERE paper_id = ${paper_id}`;
    await createUpdateDelete(query);

    res.json({
      success: true,
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = reviewerRouter;
