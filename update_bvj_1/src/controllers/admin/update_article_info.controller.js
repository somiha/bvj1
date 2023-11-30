const countryList = require("../../enums/AllCountries");
const { readData } = require("../../helper/PromiseModule");

async function renderUpdateArticleInfo(req, res){
  const paper_id = req.query.paper_id || '';
  var paper_data = {}, authors = [];
  try { 
    const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
    const paper_types_query = `SELECT id, type FROM paper_types ORDER BY id ASC`;



    const data = [
      readData(volumes_query),
      readData(paper_types_query)
    ];

    if(paper_id.length > 0){
      paper_data = await readData(`SELECT *, paper_file.id as file_id, paper_info.id as id FROM paper_info INNER JOIN paper_file ON paper_info.id = paper_file.paper_id WHERE paper_info.id = ${paper_id}`);
      authors = await readData(`SELECT * FROM paper_author WHERE paper_id = ${paper_id}`);

      if(!paper_data[0]){
        paper_data = [ { no_paper_found : true } ];
      } else {
        paper_data = paper_data[0]
      }
    }

    const result = await Promise.all(data);
    res.render('admin-panel/update-article-info', {
      path: '/update_article_info',
      user: '',
      title: 'Update Article Info',
      countryList: countryList,
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volumes: result[0],
      types: result[1],
      paper_data: paper_data, authors
    })
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderUpdateArticleInfo
}