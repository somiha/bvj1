const { COMPLETED } = require("../enums/paperCheckpoints");
const { readData } = require("./PromiseModule");

function getRecentPublishedPapers(limit){
  const select_query = `SELECT paper_info.id, paper_info.title,
  (
    SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
    FROM paper_author AS table1 
    WHERE paper_info.id = table1.paper_id
  ) AS paper_authors
  FROM paper_info 
  INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
  WHERE paper_info.checkpoint = '${COMPLETED}' ORDER BY paper_info.id DESC LIMIT ${limit}`;
  const result = readData(select_query);
  return result;
}

module.exports = getRecentPublishedPapers;