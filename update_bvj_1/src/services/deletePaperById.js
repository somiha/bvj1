const { readData } = require("../helper/PromiseModule");
const deleteUploadedFile = require("../helper/deleteUploadedFile");

async function deletePaperById(paper_id){
  const select_query = `SELECT file_url FROM paper_file WHERE paper_id = ${paper_id}`;
  var fileName = await readData(select_query);
  if(fileName[0]){
    return deleteUploadedFile(fileName[0].file_url);
  } else {
    return console.log("File not found, paper_id = ", paper_id);
  }
}

module.exports = deletePaperById;