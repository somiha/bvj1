const db = require("../../config/database.config");
const { SUBMITTED, IN_REVISION, IN_REVIEW, NEED_REVISION, REJECTED, COMPLETED, SENT_BACK_TO_AUTHOR, UPLOAD_FILE, RETURNED_PAPER, REVIEW_DONE, REVISION_DONE } = require("../../enums/paperCheckpoints");
const { readData } = require("../../helper/PromiseModule");
const deleteUploadedFile = require("../../helper/deleteUploadedFile");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");

async function trackStateCounter(id){

  // Submitted Papers (0)
  const q1 = `SELECT COUNT(checkpoint) AS submitted_paper FROM paper_info WHERE user_id = ${id} AND checkpoint=${SUBMITTED}`;
  // Submission Being Processed (0)
  const q2 = `SELECT COUNT(*) AS submission_being_processed FROM paper_info WHERE user_id = ${id} AND (checkpoint=${IN_REVIEW} OR checkpoint=${REVIEW_DONE})`;
  // Submission Needing Revision (0)
  const q3 = `SELECT COUNT(*) AS submission_needing_revision FROM paper_info WHERE user_id = ${id} AND checkpoint=${SENT_BACK_TO_AUTHOR}`;
  // Revision being Processed (0)
  const q4 = `SELECT COUNT(*) AS revision_being_processed FROM paper_info WHERE user_id = ${id} AND (paper_info.checkpoint = ${RETURNED_PAPER} OR paper_info.checkpoint = ${IN_REVISION} OR paper_info.checkpoint = ${NEED_REVISION} OR paper_info.checkpoint = ${REVISION_DONE})`;
  // Declined Revision (0)
  const q5 = `SELECT COUNT(*) AS declined_revision FROM paper_info WHERE user_id = ${id} AND checkpoint=${REJECTED}`;
  // Submission with a Decission (0)
  const q6 = `SELECT COUNT(*) AS submission_with_a_decision FROM paper_info WHERE user_id = ${id} AND checkpoint=${COMPLETED}`;

  const results = [
    readData(q1),
    readData(q2),
    readData(q3),
    readData(q4),
    readData(q5),
    readData(q6),
  ]

  var data = Promise.all(results);
  data = await data;

  const [submitted_paper, submission_being_processed, submission_needing_revision, revision_being_processed, declined_revision, submission_with_a_decision] = data;
  
  const result = [ 
    submitted_paper[0].submitted_paper,
    submission_being_processed[0].submission_being_processed,
    submission_needing_revision[0].submission_needing_revision,
    revision_being_processed[0].revision_being_processed,
    declined_revision[0].declined_revision,
    submission_with_a_decision[0].submission_with_a_decision,
  ]
 
  return result;

}

const renderTrack = async (req, res) => {
  try { 
    const { decode_data } = req;
    const { id } = decode_data;
    // Submitted Papers (0)
    const q1 = `SELECT COUNT(checkpoint) AS submitted_paper FROM paper_info WHERE user_id = ${id} AND checkpoint=${SUBMITTED}`;
    // Submission Being Processed (0)
    const q2 = `SELECT COUNT(*) AS submission_being_processed FROM paper_info WHERE user_id = ${id} AND (checkpoint=${IN_REVIEW} OR checkpoint=${REVIEW_DONE})`;
    // Submission Needing Revision (0)
    const q3 = `SELECT COUNT(*) AS submission_needing_nevision FROM paper_info WHERE user_id = ${id} AND checkpoint=${SENT_BACK_TO_AUTHOR}`;
    // Revision being Processed (0)
    const q4 = `SELECT COUNT(*) AS revision_being_processed FROM paper_info WHERE user_id = ${id} AND (paper_info.checkpoint = ${RETURNED_PAPER} OR paper_info.checkpoint = ${IN_REVISION} OR paper_info.checkpoint = ${NEED_REVISION} OR paper_info.checkpoint = ${REVISION_DONE})`;
    // Declined Revision (0)
    const q5 = `SELECT COUNT(*) AS declined_revision FROM paper_info WHERE user_id = ${id} AND checkpoint=${REJECTED}`;
    // Submission with a Decission (0)
    const q6 = `SELECT COUNT(*) AS submission_with_a_decision FROM paper_info WHERE user_id = ${id} AND checkpoint=${COMPLETED}`;

    const results = [
      readData(q1),
      readData(q2),
      readData(q3),
      readData(q4),
      readData(q5),
      readData(q6),
    ]
    

    Promise.all(results).then(async (values) => {
      const [submitted_paper, submission_being_processed, submission_needing_nevision, revision_being_processed, declined_revision, submission_with_a_decision] = values;
      res.render('track', {
        path: "/track",
        title: "Track your paper",
        isLogged: req.isLogged,
        isAdmin: req.isAdmin,
        submitted_paper: submitted_paper[0].submitted_paper,
        submission_being_processed: submission_being_processed[0].submission_being_processed,
        submission_needing_nevision: submission_needing_nevision[0].submission_needing_nevision,
        revision_being_processed: revision_being_processed[0].revision_being_processed,
        declined_revision: declined_revision[0].declined_revision,
        submission_with_a_decision: submission_with_a_decision[0].submission_with_a_decision,
        recentPapers: await getRecentPublishedPapers(10)
      })
    })
  } catch(error) { 
    console.log(error)
  }
}

async function renderNeedRevision(req, res){
  res.render('track/need-revision', {
    path: "/track",
    title: "Submission Needing Revision",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)
  })
}


async function needRevisionPaperList(req, res){
  try { 
    const { decode_data } = req;
    const { id } = decode_data;
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors
    FROM paper_info 
    INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
    WHERE paper_info.checkpoint = ${SENT_BACK_TO_AUTHOR} AND paper_info.user_id = ${id} ORDER BY paper_info.id DESC`;
    
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

const renderUploadUpdatedFile = async (req, res) => {
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
      if(result[0].checkpoint !== SENT_BACK_TO_AUTHOR){
        hasError = true;
        errorMessage = "You can't uploaded file for this paper now";
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
    res.render('submit/upload-file', {
      title: hasError ? errorMessage : "Upload file for your paper",
      path: "/submit",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      paper_id: req.params.paper_id,
      hasPermission, hasError, errorMessage,
      recentPapers: await getRecentPublishedPapers(10)
    })
  }
}

const doUpdatedUploadFile = async (req, res) => {
  try { 
    const { paper_id } = req.params;

    const { file } = req;

    const query1 = `UPDATE paper_info SET checkpoint = '${RETURNED_PAPER}' WHERE id = ${paper_id}`;
    const query2 = `UPDATE paper_file SET file_url = '${file.filename}', file_type = '${file.mimetype.split('/')[1]}' WHERE paper_id = ${paper_id}`;
    
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
    res.status(500).json({ message: "Something went wrong!", error });
  }
}

async function renderRevisionInProcess(req, res){
  res.render('track/revision-being-processed', {
    path: "/track",
    title: "Submission Being Processed",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)
  })
}

async function revisonBeingProcessedPaperList(req, res){
  try { 
    const { decode_data } = req;
    const { id } = decode_data;
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors
    FROM paper_info 
    INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
    WHERE paper_info.user_id = ${id} AND (paper_info.checkpoint = ${RETURNED_PAPER} OR paper_info.checkpoint = ${IN_REVISION} OR paper_info.checkpoint = ${NEED_REVISION} OR paper_info.checkpoint = ${REVISION_DONE}) ORDER BY paper_info.id DESC`;
    
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

async function renderSubmittedPapers(req, res){
  res.render('track/submitted-papers', {
    path: "/track",
    title: "Submission Needing Revision",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)
  })
}

async function submittedPaperList(req, res){
  try { 
    const { decode_data } = req;
    const { id } = decode_data;
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors
    FROM paper_info 
    INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
    WHERE paper_info.checkpoint = ${SUBMITTED} AND paper_info.user_id = ${id} ORDER BY paper_info.id DESC`;
    
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

async function renderSubmissionProcessed(req, res){
  res.render('track/submission-being-processed', {
    path: "/track",
    title: "Submission Being Processed",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)
  })
}

async function submissionBeingProcessedList(req, res){
  try { 
    const { decode_data } = req;
    const { id } = decode_data;
    const select_query = `SELECT *, 
    (
      SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ') 
      FROM paper_author AS table1 
      WHERE paper_info.id = table1.paper_id
    ) AS paper_authors
    FROM paper_info 
    INNER JOIN paper_file ON paper_info.id = paper_file.paper_id 
    WHERE (checkpoint=${IN_REVIEW} OR checkpoint=${REVIEW_DONE}) AND paper_info.user_id = ${id} ORDER BY paper_info.id DESC`;
    
    const result = await readData(select_query);
    res.json(result);
  } catch(error) { 
    console.log(error)
  }
}

async function completedPapersAuthorList(req, res){
  const select_query = `SELECT *, paper_info.title as title, volumes.title AS volume_title,
                        (
                          SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ')
                          FROM paper_author AS table1
                          WHERE paper_info.id = table1.paper_id
                        ) AS paper_author FROM paper_info
                        INNER JOIN paper_file
                          ON paper_info.id = paper_file.paper_id
                        INNER JOIN volumes 
                          ON paper_info.volume = volumes.id
                        WHERE paper_info.checkpoint = ${COMPLETED} AND paper_info.user_id = ${req.decode_data.id}
                        ORDER BY paper_info.id DESC`;
  const result = await readData(select_query);
  console.log(result);
  res.json(result);
}

async function rejectedPapersAuthorList(req, res){
  const select_query = `SELECT *,
                        (
                          SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ')
                          FROM paper_author AS table1
                          WHERE paper_info.id = table1.paper_id
                        ) AS paper_author FROM paper_info
                        INNER JOIN paper_file
                          ON paper_info.id = paper_file.paper_id
                        WHERE paper_info.checkpoint = ${REJECTED} AND paper_info.user_id = ${req.decode_data.id}`;
  const result = await readData(select_query);
  res.json(result);
}

async function renderCompletedPaperAuthor(req, res){
  res.render('track/completed-paper', {
    path: '/completed_paper',
    user: '',
    title: 'Request for Review',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)  
  })
}

async function renderRejectedPaperAuthor(req, res){
  res.render('track/rejected-paper', {
    path: '/completed_paper',
    user: '',
    title: 'Request for Review',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: await getRecentPublishedPapers(10)
  })
}

module.exports = {
  renderTrack,
  renderNeedRevision,
  needRevisionPaperList,
  renderUploadUpdatedFile,
  doUpdatedUploadFile,
  renderRevisionInProcess,
  revisonBeingProcessedPaperList,
  renderSubmittedPapers,
  submittedPaperList,
  renderSubmissionProcessed,
  submissionBeingProcessedList,
  completedPapersAuthorList,
  renderCompletedPaperAuthor,
  renderRejectedPaperAuthor,
  rejectedPapersAuthorList,
  trackStateCounter
}