const db = require("../config/database.config");

async function insertAndGetID(sqlQuery, sqlValue) {
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, sqlValue, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

module.exports = insertAndGetID;
