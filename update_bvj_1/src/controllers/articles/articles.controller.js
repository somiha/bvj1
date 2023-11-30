const { COMPLETED } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");

async function renderArticles(req, res){
  try { 
    const select_query = `SELECT * FROM volumes ORDER BY position ASC`;
    const result = await readData(select_query);
    const recentPapers = await getRecentPublishedPapers(10);
    res.render('articles', {
      title: "Articles",
      path: "/articles",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volumes: result,
      recentPapers
    })
  } catch(error) { 
    console.log(error)
  }
}

async function renderArticlesInVolume(req, res){
  try { 
    const page = req.query.page || 1;
    const volume_id = req.params.volume_id;
    const volume_query = `SELECT title FROM volumes WHERE id = '${volume_id}'`;
    const select_query = `SELECT paper_info.id as paper_id, paper_info.title as paper_title, volume, page, file_url,  volumes.title as volume_title, (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
                            FROM paper_author AS table1 
                            WHERE paper_info.id = table1.paper_id
                          ) as paper_author FROM paper_info 
                          INNER JOIN volumes 
                            ON paper_info.volume = volumes.id 
                          INNER JOIN paper_file 
                            ON paper_info.id = paper_file.paper_id 
                          WHERE paper_info.volume = '${volume_id}'AND paper_info.checkpoint = ${COMPLETED} LIMIT 20 OFFSET ${ 20 * (page - 1)}`;
    
    const select_editorial_query = `SELECT * FROM editorials WHERE volume = ${volume_id}`;

    const queries = [
      readData(volume_query),
      readData(select_query),
      getRecentPublishedPapers(10),
      readData(select_editorial_query)
    ]

    const result = await Promise.all(queries);

    const volume = result[0];
    const articles = result[1];
    const recentPapers = result[2];
    const editorials = result[3];

    res.render('articles/details', {
      title: "Articles",
      path: "/articles",
      isLogged: req.isLogged, isAdmin: req.isAdmin,
      articles, editorials,
      volume_id, volume: volume[0].title,
      page, recentPapers
    })
  } catch(error) { 
    console.log(error)
  }
}

async function renderArticleById(req, res){
  try { 
    const page = req.query.page || 1;
    const paper_id = req.params.paper_id;
    const paper_query = `SELECT paper_types.type as paper_type, paper_info.abstract, paper_info.keywords, paper_info.id as paper_id, paper_info.title as paper_title, volume, page, file_url,  volumes.title as volume_title
                          FROM paper_info 
                          INNER JOIN volumes 
                            ON paper_info.volume = volumes.id 
                          INNER JOIN paper_file 
                            ON paper_info.id = paper_file.paper_id 
                          INNER JOIN paper_types
                            ON paper_info.type = paper_types.id
                          WHERE paper_info.id = '${paper_id}' AND paper_info.checkpoint = ${COMPLETED}`;
    const author_query = `SELECT  
                          first_name, middle_name, last_name, 
                          affiliation 
                          FROM paper_author 
                          WHERE paper_id = ${paper_id}`;
    
    const queries = [
      readData(paper_query),
      readData(author_query),
      getRecentPublishedPapers(10)
    ]

    const result = await Promise.all(queries);

    var paperArray = result[0];
    var authors = result[1];
    var recentPapers = result[2];

    res.render('articles/paper_details', {
      title: 'View Paper : ' + result[0].paper_title,
      path: "/articles",
      isLogged: req.isLogged, 
      isAdmin: req.isAdmin,
      page, recentPapers, paper: paperArray[0], authors
    })
  } catch(error) { 
    console.log(error);
  }
}

const renderEditorialById = async (req, res) => {
  try { 
    const editorial_id = req.params.editorial_id;
    const editorial_query = `SELECT volumes.id as id, editorials.title as title, description, file_url, volumes.title as volume_title, volumes.id as volume_id FROM editorials INNER JOIN volumes ON editorials.volume = volumes.id WHERE editorials.id = '${editorial_id}'`;
    var editorial = await readData(editorial_query);
    if(!editorial[0]){
      res.redirect('/admin_panel/editorial/view?msg=Editorial Not Found!');
      return;
    }
    const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
    var data = await readData(volumes_query);
    res.render('articles/editorial_details', {
      title: "Editorials",
      path: "/articles",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volume: data,
      isError: false,
      msg: '',
      editPath: 'view',
      editorial: editorial[0] ? editorial[0] : {},
      recentPapers: await getRecentPublishedPapers(10)
    })
  } catch(error) { 
    console.log(error)
  }
}


module.exports = {
  renderArticles,
  renderArticlesInVolume,
  renderArticleById,
  renderEditorialById
}