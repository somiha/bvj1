const { IN_REVIEW } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");

const renderWaitingForReview = (req, res) => {
  res.render('admin-panel/waiting-for-review', {
    path: '/waiting_for_review',
    user: '',
    title: 'Waiting for Review',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  })
}

async function waitingForReviewList(req, res) {
  try {
    const select_query = `SELECT paper_reviewer.id, CONCAT(SUBSTR(reviewers.first_name, 1,1), SUBSTR(reviewers.middle_name, 1, 1), " ", reviewers.last_name) as reviewer_name, paper_reviewer.id, 
                          paper_file.file_url, paper_info.title, paper_info.id as paper_id,
                          (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
                            FROM paper_author AS table1 
                            WHERE paper_info.id = table1.paper_id
                          ) as paper_author FROM paper_reviewer 
                          INNER JOIN paper_info 
                            ON paper_reviewer.paper_id = paper_info.id 
                          INNER JOIN paper_file 
                            ON paper_reviewer.paper_id = paper_file.paper_id 
                          INNER JOIN reviewers 
                            ON paper_reviewer.reviewer_id = reviewers.id
                          WHERE paper_reviewer.status = 'accepted'
                          AND paper_info.checkpoint = '${IN_REVIEW}'`;
    const result = await readData(select_query);
    res.json(result);
  } catch(error) {
    console.log(error)
  }
}

module.exports = {
  renderWaitingForReview,
  waitingForReviewList,
}