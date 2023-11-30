const db = require("../config/database.config");

async function TranasctionTwo(query1, query2) {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Perform the first query
        const result1 = await executeQuery(query1);
        // Perform the second query
        const result2 = await executeQuery(query2);

        // Commit the transaction if all queries succeed
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              throw err;
            });
          }
          resolve({ result1, result2, result3 });
        });
      } catch (error) {
        // Rollback the transaction if any query fails
        db.rollback(() => {
          throw error;
        });
      }
    });
  });
}

async function TranasctionThree(query1, query2, query3) {
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Perform the first query
        const result1 = await executeQuery(query1);
        // Perform the second query
        const result2 = await executeQuery(query2);
        // Perform the third query
        const result3 = await executeQuery(query3);

        // Commit the transaction if all queries succeed
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              throw err;
            });
          }
          resolve({ result1, result2, result3 });
        });
      } catch (error) {
        // Rollback the transaction if any query fails
        db.rollback(() => {
          throw error;
        });
      }
    });
  });
}

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  TranasctionTwo,
  TranasctionThree,
};
