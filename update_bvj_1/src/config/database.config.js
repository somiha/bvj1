const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "codefjhu_axfccsd",
//   password: "@2022-fxer-11",
//   database: "codefjhu_bvjdb",
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "bvj1",
});

db.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Database Connected!");
  }
});

module.exports = db;
