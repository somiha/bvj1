const { SUBMITTED } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");

const renderRecentSubmissions = async (req, res) => {
  try { 
    res.render('admin-panel/recent-submission', {
      path: '/recent_submissions',
      user: '',
      title: 'Recent Submissions',
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
    })
  } catch(error) { 
    console.log(error);
  }
}

const paperList = async (req, res) => {
  try { 
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors
    FROM paper_info 
                          INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
                          WHERE paper_info.checkpoint = '${SUBMITTED}' ORDER BY paper_info.id DESC`;
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderRecentSubmissions,
  paperList
}