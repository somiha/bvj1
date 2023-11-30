const { IN_REVIEW, SUBMITTED, IN_REVISION } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");
const Tranasction = require("../../helper/dbTransactionQuery");

const renderRequestForReview = (req, res) => {
  res.render('reviewer-panel/request_for_review', {
    path: '/request_for_review',
    user: '',
    title: 'Request for Review',
    isLogged: req.isLogged,
  })
}

async function apiRqForReviewList(req, res) {
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
                          WHERE paper_reviewer.reviewer_id = '${req.decode_data.id}' AND paper_reviewer.status='pending'`;
    const result = await readData(select_query);
    res.json(result);
  } catch(error) {
    console.log(error)
  }
}

async function apiAcptRqForReview(req, res){
  try {
    const { paper_id } = req.body;
    const reviewer_id = req.decode_data.id;
    const select_query = `SELECT checkpoint FROM paper_info WHERE id=${paper_id}`;
    var checkpoint = await readData(select_query);

    checkpoint = parseInt(checkpoint[0].checkpoint);

    const query1 = `UPDATE paper_reviewer SET status = 'accepted' WHERE paper_id = ${paper_id} AND reviewer_id = ${reviewer_id}`;
    const query2 = `UPDATE paper_info SET checkpoint = ${checkpoint === SUBMITTED ? IN_REVIEW : IN_REVISION} WHERE id = ${paper_id}`;
    const query3 = `DELETE FROM paper_reviewer WHERE paper_id = ${paper_id} AND reviewer_id <> ${reviewer_id}`;
    Tranasction.TranasctionThree(query1, query2, query3);
    res.json({
      success: true,
      message: "Request accepted successfully"
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}


module.exports = {
  renderRequestForReview,
  apiRqForReviewList,
  apiAcptRqForReview
}