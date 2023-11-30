const fs = require('fs');

async function deleteUploadedFile(path) {
  try { 
    fs.unlink(`./public/uploads/papers/${path}`, (err) => {
      if(err){
        console.log(err);
      }
    });
  } catch(error) { 
    console.log(error);
  }
};

module.exports = deleteUploadedFile;