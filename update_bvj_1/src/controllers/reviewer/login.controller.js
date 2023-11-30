const { readData } = require("../../helper/PromiseModule");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function renderRevLoginPage(req, res){
  res.render('reviewer-panel/login', {
    path: '/login',
    title: 'Reviewer Login',
    isLogged: req.isLogged,
    isReviewer: req.isReviewer,
  })
}

async function doRevLogin(req, res){
  try { 
    const { email, password } = req.body;
    const user_by_email = `SELECT id, first_name, middle_name, last_name, email, password FROM reviewers WHERE email = '${email}'`;
    const getData = await readData(user_by_email);
    if (getData.length === 0) {
      res.send({
        success: false,
        message: "Email is not registered"
      });
    } else {
      if (bcrypt.compareSync(password, getData[0].password)) {
        const token = jwt.sign({ id: getData[0].id, first_name: getData[0].first_name, middle_name: getData[0].middle_name, last_name: getData[0].last_name, email: getData[0].email, role: 'reviewer' }, process.env.JWT_REVIEWER_SECRET, { expiresIn: '365d' });
        res.cookie('usr_token', token, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.send({
          success: true,
          message: "Login Successful",
        });
      } else {
        res.send({
          success: false,
          message: "Password is incorrect"
        });
      }
    }
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderRevLoginPage,
  doRevLogin
}