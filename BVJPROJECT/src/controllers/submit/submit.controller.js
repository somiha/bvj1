const db = require("../../config/database.config");
const { ADD_AUTHOR, UPLOAD_FILE, SUBMITTED } = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const deleteUploadedFile = require("../../helper/deleteUploadedFile");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");
const createPaperId = require("../../services/createPaperId");

const renderSubmit = async (req, res) => {
  const recentPapers = await getRecentPublishedPapers(10);
  res.render('submit', {
    title: "Submit your paper",
    path: "/submit",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers
  })
}

const doSubmit = async (req, res) => {
  try { 
    const { title, type, abstract, keywords } = req.body;
    const user_id = req.decode_data.id;
    const paper_id = await createPaperId();
    const insert_query = (paper_id) => `INSERT INTO paper_info (id, user_id, checkpoint, title, type, abstract, keywords ) VALUES (${paper_id}, ${user_id}, ${ADD_AUTHOR}, '${title}', '${type}', '${abstract}', '${keywords}' )`;

    const storeData = (query) => db.query(query, (err, result) => {
      if(err) {
        if(err.code){
          if(err.code === "ER_DUP_ENTRY"){
            storeData(insert_query(paper_id + 1));
          }
        }
      }
    })
    storeData(insert_query(paper_id));
    res.redirect(`/submit/${paper_id}/add-author`);
  } catch(error) {
    console.log(error);
    res.redirect('/error');
  }
}


const renderAddAuthor = async (req, res) => {
  var hasPermission, hasError, errorMessage = "", userInfo;
  const { paper_id } = req.params;
  const msg = req.query.msg || '';
  try { 
    const { id, first_name, middle_name, last_name, email } = req.decode_data;
    userInfo = { first_name, middle_name, last_name, email };
    const select_query = `SELECT user_id FROM paper_info WHERE id = ${paper_id}`;
    const result = await readData(select_query);
    if(!result[0]) {
      hasError = true;
      errorMessage = "Paper not found";
    } else {
      if(result[0].user_id === id) {
        hasPermission = true;
      } else {
        hasError = true;
        errorMessage = "You don't have permission to add author for this paper";
      }
    }
  } catch(error) { 
    console.log(error)
  } finally {
    var recentPapers = getRecentPublishedPapers(10);
    var alreadyAddedAuthors = readData(`SELECT first_name, middle_name, last_name, email, paper_author.id as id, paper_info.id as paper_id FROM paper_author INNER JOIN paper_info ON paper_info.id = paper_author.paper_id WHERE paper_id = ${paper_id}`);

    recentPapers = await recentPapers;
    alreadyAddedAuthors = await alreadyAddedAuthors;

    res.render('submit/add-author', {
      title: hasError ? errorMessage : "Add author info for your paper",
      path: "/submit",
      isLogged: req.isLogged,
      paper_id: req.params.paper_id,
      hasPermission, hasError, errorMessage, userInfo,
      isAdmin: req.isAdmin,
      paperId: req.params.paper_id,
      recentPapers, alreadyAddedAuthors, msg
    })
  }
}

const doAddAuthor = async (req, res) => {
  const { paper_id } = req.params;
  try {
    var authorList = readData('SELECT id FROM paper_author WHERE paper_id = ' + paper_id);
    var corresponding_author = readData(`SELECT id FROM paper_author WHERE paper_id = ${paper_id} AND is_corresponding = 1`);

    authorList = await authorList;
    corresponding_author = await corresponding_author;

    if(authorList[0]){
      if(corresponding_author[0]){
        const update_checkpoint_query = `UPDATE paper_info SET checkpoint = '${UPLOAD_FILE}' WHERE id = ${paper_id}`;
        createUpdateDelete(update_checkpoint_query);
        res.redirect(`/submit/${paper_id}/upload-file`);
      } else {
        res.redirect(`/submit/${paper_id}/add-author?msg=${encodeURIComponent('Please Add a Corresponding Author For This Paper.')}`);
      }
    } else {
      res.redirect(`/submit/${paper_id}/add-author?msg=${encodeURIComponent('Please Add One or More Author For This Paper.')}`);
    }
  } catch(error) { 
    console.log(error);
  }
}

const renderUploadFile = async (req, res) => {
  var hasPermission = false, hasError, errorMessage = "";
  try { 
    const { paper_id } = req.params;
    const { id } = req.decode_data;
    const select_query = `SELECT user_id, checkpoint FROM paper_info WHERE id = ${paper_id}`;
    const result = await readData(select_query);
    if(!result[0]) {
      hasError = true;
      errorMessage = "Paper not found";
    } else {
      if(result[0].checkpoint !== UPLOAD_FILE){
        hasError = true;
        errorMessage = "You already uploaded file for this paper";
      } else if(result[0].user_id === id) {
        hasPermission = true;
      } else {
        hasError = true;
        errorMessage = "You don't have permission to upload file for this paper";
      }
    }
  } catch(error) { 
    console.log(error)
  } finally {
    const recentPapers = await getRecentPublishedPapers(10);
    res.render('submit/upload-file', {
      title: hasError ? errorMessage : "Upload file for your paper",
      path: "/submit",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      paper_id: req.params.paper_id,
      hasPermission, hasError, errorMessage, 
      recentPapers
    })
  }
}

const doUploadFile = async (req, res) => {
  try { 
    const { paper_id } = req.params;
    const { id } = req.decode_data;
    const select_query = `SELECT user_id FROM paper_info WHERE id = ${paper_id}`;
    const result = await readData(select_query);

    if(!result[0]) {
      deleteUploadedFile(req.file.filename);
      res.status(404).json({ message: "Paper not found" });
    } else if(result[0].user_id !== id) {
      deleteUploadedFile(req.file.filename);
      res.status(403).json({ message: "You don't have permission to upload file for this paper" });
    }
    const { file } = req;
    const fileType = file.filename.split('.');
    const query1 = `UPDATE paper_info SET checkpoint = '${SUBMITTED}' WHERE id = ${paper_id}`;
    const query2 = `INSERT INTO paper_file SET paper_id = ${paper_id}, file_url = '${file.filename}', file_type = '${fileType[fileType.length - 1]}'`;
    
    db.beginTransaction(function(err) {
      if(err) throw err;
      db.query(query1, function(err, result) {
        if(err) { 
          return db.rollback(function() {
            throw err;
          });
        }
      });

      db.query(query2, function(err, result) {
        if(err) { 
          return db.rollback(function() {
            throw err;
          });
        }
        db.commit(function(err) {
          if (err) {
            deleteUploadedFile(req.file.filename);
            return db.rollback(function() {
              throw err;
            });
          }
          res.status(200).json({ message: "File uploaded successfully" });
        });
      });
    });
  } catch(error) { 
    deleteUploadedFile(req.file.filename);
    res.status(500).json({ message: "Something went wrong!" });
  }
}


async function apiDoAddAuthor(req, res) {
  try { 
    const { paper_id, first_name, is_corresponding, middle_name, last_name, email, affiliation, country } = req.body;
    const checkIfExist = `SELECT id, first_name, middle_name, last_name, email FROM paper_author WHERE paper_id = ${paper_id}`;
    const result = await readData(checkIfExist);
    
    if(result.find((item) => item.email === email)) {
      return res.json({
        success: false,
        message: "This author already added",
        data: result
      })
    }
    const insert_query = `INSERT INTO paper_author (paper_id, is_corresponding, first_name, middle_name, last_name, email, affiliation, country) VALUES (${paper_id}, ${is_corresponding}, '${first_name}', '${middle_name}', '${last_name}', '${email}', '${affiliation}', '${country}');`;
    const insertResult = await createUpdateDelete(insert_query);
    res.json({
      success: true,
      message: "Author added successfully",
      data: [
        ...result,
        {
          id: insertResult.insertId ,first_name, middle_name, last_name, email
        }
      ]
    })
  } catch(error) { 
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

async function apiDeleteAuthor(req, res) {
  try { 
    const { paper_id, author_id } = req.body;
    const delete_query = `DELETE FROM paper_author WHERE paper_id = ${paper_id} AND id = ${author_id}`;
    await createUpdateDelete(delete_query);
    const select_query = `SELECT id, first_name, middle_name, last_name, email FROM paper_author WHERE paper_id = ${paper_id}`;
    const data = await readData(select_query);
    res.send({
      success: true,
      message: 'Deleted Successfully',
      data
    })
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderSubmit,
  doSubmit,
  renderAddAuthor,
  doAddAuthor,
  renderUploadFile,
  doUploadFile,
  apiDoAddAuthor,
  apiDeleteAuthor
}