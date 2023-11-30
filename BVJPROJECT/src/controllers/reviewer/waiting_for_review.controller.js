const { REVIEW_DONE, IN_REVIEW, REVISION_DONE, IN_REVISION } = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const { TranasctionTwo, TranasctionThree } = require("../../helper/dbTransactionQuery");

async function renderWaitingForReview(req, res){
  res.render('reviewer-panel/waiting_for_review', {
    path: '/waiting_for_review',
    user: '',
    title: 'Waiting for Review',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  })
}

async function apiWaitingForReviewList(req, res) {
  try {
    const select_query = `SELECT *, (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
                            FROM paper_author AS table1 
                            WHERE paper_info.id = table1.paper_id
                          ) as paper_author FROM paper_reviewer 
                          INNER JOIN paper_info 
                            ON paper_reviewer.paper_id = paper_info.id 
                          INNER JOIN paper_file 
                            ON paper_reviewer.paper_id = paper_file.paper_id 
                          WHERE paper_reviewer.reviewer_id = '${req.decode_data.id}'
                          AND (paper_info.checkpoint = ${IN_REVIEW} OR paper_info.checkpoint = ${IN_REVISION})`;
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
    const select_query = `SELECT * FROM paper_review WHERE paper_id = ${paper_id} AND reviewer_id = ${reviewer_id}`;
    const result = await readData(select_query);
    if(result.length > 0) {
      const update_query = `UPDATE paper_review SET files_url = '${files_url}', comment = '${comment}' WHERE paper_id = ${paper_id} AND reviewer_id = ${reviewer_id}`;
      createUpdateDelete(update_query);
      res.json({
        success: true,
        message: "Review Updated"
      });
      return;
    }

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
    const select_query = `SELECT checkpoint FROM paper_info WHERE paper_info.id=${paper_id}`;
    const select_query2 = `SELECT * FROM paper_review WHERE paper_id = ${paper_id} AND reviewer_id = ${req.decode_data.id}`;
    var checkpoint = readData(select_query);
    var review = readData(select_query2);

    checkpoint = await checkpoint;
    checkpoint = parseInt(checkpoint[0].checkpoint);
    review = await review;

    if(review.length === 0) {
      return res.json({
        success: false,
        message: "Please save your review first"
      });
    } else {
      const query1 = `DELETE FROM paper_reviewer WHERE paper_id = ${paper_id} AND reviewer_id = ${req.decode_data.id}`;
      const query2 = `UPDATE paper_info SET checkpoint = ${checkpoint === IN_REVIEW ? REVIEW_DONE : REVISION_DONE}, reviewer_id = ${req.decode_data.id} WHERE id = ${paper_id}`;
      const query3 = `UPDATE reviewers SET total_review = total_review + 1 WHERE id = ${req.decode_data.id}`;
      TranasctionThree(query1, query2, query3);
    }
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
  renderWaitingForReview,
  apiWaitingForReviewList,
  apiSaveReview,
  apiSubmitReview
}