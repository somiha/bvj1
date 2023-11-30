const { REVIEW_DONE, IN_REVIEW, REVISION_DONE } = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");

async function renderReviewedPaper(req, res){
  res.render('reviewer-panel/reviewed_paper', {
    path: '/reviewed_paper',
    user: '',
    title: 'Reviewed Papers',
    isLogged: req.isLogged,
  })
}

async function apiReviewedPaperList(req, res) {
  try {
    const select_query = `SELECT *, (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
                            FROM paper_author AS table1 
                            WHERE paper_info.id = table1.paper_id
                          ) as paper_author FROM paper_review 
                          INNER JOIN paper_info 
                            ON paper_review.paper_id = paper_info.id 
                          INNER JOIN paper_file 
                            ON paper_review.paper_id = paper_file.paper_id 
                          WHERE paper_review.reviewer_id = '${req.decode_data.id}'
                          AND (paper_info.checkpoint = ${REVIEW_DONE} OR paper_info.checkpoint = ${REVISION_DONE})`;
    const result = await readData(select_query);
    res.json(result);
  } catch(error) {
    console.log(error)
  }
}

async function apiSaveReview(req, res) {
  try { 
    const { paper_id, files_url, comment } = req.body;
    const reviewer_id = req.decode_data.id;
    const insert_query = `INSERT INTO paper_review (paper_id, reviewer_id, files_url, comment) VALUES (${paper_id}, ${reviewer_id}, '${files_url}', '${comment}')`;
    createUpdateDelete(insert_query);
    res.json({
      success: true,
      message: "Review Saved"
    });
  } catch(error) { 
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong"
    });
  }
}

async function apiSubmitReview(req, res) {
  try {
    const { paper_id } = req.body;
    const update_query = `UPDATE paper_info SET checkpoint = '${REVIEW_DONE}' WHERE id = ${paper_id}`;
    createUpdateDelete(update_query);
    res.json({
      success: true,
      message: "Review Submitted"
    });
  } catch(error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong"
    });
  }
}

module.exports = {
  renderReviewedPaper,
  apiReviewedPaperList,
  apiSaveReview,
  apiSubmitReview
}