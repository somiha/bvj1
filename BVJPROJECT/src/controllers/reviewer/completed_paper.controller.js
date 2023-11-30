const { COMPLETED } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");

async function renderCompletedPaperReviewer(req, res){
  res.render('reviewer-panel/completed_paper', {
    path: '/completed_paper',
    user: '',
    title: 'Request for Review',
    isLogged: req.isLogged,
  })
}

async function completedPaperListReviewer(req, res){
  const select_query = `SELECT *,
                        (
                          SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ')
                          FROM paper_author AS table1
                          WHERE paper_info.id = table1.paper_id
                        ) AS paper_author FROM paper_info
                        INNER JOIN paper_file
                          ON paper_info.id = paper_file.paper_id
                        WHERE paper_info.checkpoint = ${COMPLETED} AND paper_info.reviewer_id = ${req.decode_data.id}`;
  const result = await readData(select_query);
  res.json(result);
}


module.exports = {
  renderCompletedPaperReviewer,
  completedPaperListReviewer
}