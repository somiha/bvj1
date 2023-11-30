const { author_paper_update } = require("../../config/nodemailer.config");
const {
  REVIEW_DONE,
  NEED_REVISION,
  SENT_BACK_TO_AUTHOR,
} = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const { trackStateCounter } = require("../track/track.controller");

async function renderReviewedPaper(req, res) {
  res.render("admin-panel/reviewed-paper", {
    path: "/reviewed_paper",
    user: "",
    title: "Reviewed Paper",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
}

async function reviewedPaperList(req, res) {
  try {
    const select_query = `SELECT *, (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
                            FROM paper_author AS table1 
                            WHERE paper_info.id = table1.paper_id
                          ) as paper_author FROM paper_info 
                          INNER JOIN paper_review 
                            ON paper_review.paper_id = paper_info.id 
                          INNER JOIN paper_file 
                            ON paper_info.id = paper_file.paper_id 
                          WHERE paper_info.checkpoint = '${REVIEW_DONE}'`;
    const result = await readData(select_query);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}

async function sendBackToAuthor(req, res) {
  try {
    const { paper_id } = req.body;
    const update_query = `UPDATE paper_info SET checkpoint = '${SENT_BACK_TO_AUTHOR}' WHERE id = ${paper_id}`;
    await createUpdateDelete(update_query);

    /* Send email to author */
    author_paper_update(
      paper_id,
      true,
      "Your paper has been sent back to you for revision"
    );

    res.json({
      success: true,
      message: "Paper sent back to author",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  renderReviewedPaper,
  reviewedPaperList,
  sendBackToAuthor,
};
