const { IN_REVISION } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");

const renderPaperInRevision = async (req, res) => {
  try { 
    res.render('admin-panel/paper-in-revision', {
      path: '/paper_in_revision',
      user: '',
      title: 'Paper in Review',
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
    })
  } catch(error) { 
    console.log(error);
  }
}

const paperInRevisionList = async (req, res) => {
  try { 
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors FROM paper_review 
    INNER JOIN paper_info 
      ON paper_review.paper_id = paper_info.id 
    INNER JOIN paper_file 
      ON paper_review.paper_id = paper_file.paper_id 
    WHERE paper_info.checkpoint = ${IN_REVISION}
    ORDER BY paper_info.id DESC`;
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderPaperInRevision,
  paperInRevisionList
}