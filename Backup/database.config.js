const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'codefjhu_axfccsd',
  password: '@2022-fxer-11',
  database: 'codefjhu_bvjdb'
});


db.connect(function(error){
    if(error){
        console.log(error);
    }else{
      console.log("Database Connected!");
    }
})


module.exports = db;