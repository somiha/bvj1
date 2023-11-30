const db = require("../config/database.config");

async function TranasctionTwo(query1, query2){
  return db.beginTransaction(function(err) {
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
          return db.rollback(function() {
            throw err;
          });
        }
      });
    });
  });
}

async function TranasctionThree(query1, query2, query3){
  return db.beginTransaction((err) => {
    if (err) throw err;
  
    // Perform the first query
    db.query(query1, (err, result) => {
      if (err) {
        // Rollback the transaction if the query fails
        return db.rollback(() => {
          throw err;
        });
      }
  
      // Perform the second query
      db.query(query2, (err, result) => {
        if (err) {
          // Rollback the transaction if the query fails
          return db.rollback(() => {
            throw err;
          });
        }
  
        // Perform the third query
        db.query(query3, (err, result) => {
          if (err) {
            // Rollback the transaction if the query fails
            return db.rollback(() => {
              throw err;
            });
          }
  
          // Commit the transaction if all queries succeed
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          });
        });
      });
    });
  });
}

module.exports = {
  TranasctionTwo,
  TranasctionThree
};