const {
  NEED_REVISION,
  RETURNED_PAPER,
} = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");

async function renderReturnedPaper(req, res) {
  res.render("admin-panel/returned-paper", {
    path: "/returned_paper",
    user: "",
    title: "Sent Back to Author",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
}

async function returnedPaperList(req, res) {
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
                          WHERE paper_info.checkpoint = ${RETURNED_PAPER}`;
    const result = await readData(select_query);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}

async function sendBackToAuthor(req, res) {
  try {
    const { paper_id } = req.body;
    const update_query = `UPDATE paper_info SET checkpoint = '${NEED_REVISION}' WHERE id = ${paper_id}`;
    await createUpdateDelete(update_query);
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
  renderReturnedPaper,
  returnedPaperList,
  sendBackToAuthor,
};
