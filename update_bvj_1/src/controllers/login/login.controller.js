const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { send_recovery_mail } = require("../../config/nodemailer.config");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");
const dcryptPass = require("../../helper/DcryptPassword");

// @Render
const renderLogin = async (req, res) => {
  const recentPapers = await getRecentPublishedPapers(10);
  res.render("login", {
    path: "/login",
    title: "Login",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers,
  });
};

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL, role: "admin" },
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie("usr_token", token, { httpOnly: true });
      res.send({
        success: true,
        message: "Admin Login Successful",
        role: "admin",
      });
    } else {
      const user_by_email = `SELECT * FROM users WHERE email = '${email}'`;
      const getData = await readData(user_by_email);
      if (getData.length === 0) {
        res.send({
          success: false,
          message: "Email is not registered",
        });
      } else {
        if (bcrypt.compareSync(password, getData[0].password)) {
          const token = jwt.sign({ ...getData[0] }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
          res.cookie("usr_token", token, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.send({
            success: true,
            message: "Login Successful",
            role: getData[0].role,
          });
        } else {
          res.send({
            success: false,
            message: "Password is incorrect",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// @Render
const renderForgotPass = (req, res) => {
  res.render("login/forgot-pass", {
    path: "/forgot-password",
    title: "Forgot Password",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
};
const searchEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const search_query = `SELECT email FROM users WHERE email = '${email}'`;
    const getData = await readData(search_query);
    if (getData.length === 0) {
      res.send({
        success: false,
        message: "Email Not Found",
      });
    } else {
      res.send({
        success: true,
        message: "Email Found",
        data: getData[0],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const query = `SELECT first_name ,remember_key FROM users WHERE email = '${email}'`;
    const getData = await readData(query);
    if (getData.length > 0) {
      send_recovery_mail(getData[0].first_name, getData[0].remember_key, email);
    }
    res.send({
      success: true,
      message: "Email sent, please check your inbox",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error occured!",
    });
  }
};

// @Render
const renderResetPass = async (req, res) => {
  try {
    const { token, mail } = req.query;
    const query = `SELECT remember_key FROM users WHERE email = '${mail}'`;
    const getData = await readData(query);
    if (getData.length > 0) {
      if (token === getData[0].remember_key) {
        res.render("login/reset-pass", {
          path: "/login",
          title: "Reset Password",
          token: token,
          mail: mail,
          isLogged: req.isLogged,
          isAdmin: req.isAdmin,
          errorMsg: "",
          successMsg: "",
        });
      } else {
        res.render("404");
      }
    } else {
      res.render("404");
    }
  } catch (error) {
    console.log(error);
  }
};

const doResetPass = async (req, res) => {
  const { token, email, password, c_password } = req.body;
  if (password !== c_password) {
    res.render("login/reset-pass", {
      path: "/login",
      title: "Reset Password",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      mail: email,
      errorMsg: "Password and Confirm Password does not match",
      token,
      successMsg: "",
    });
  } else {
    try {
      const query = `SELECT remember_key FROM users WHERE email = '${email}'`;
      const getData = await readData(query);
      if (getData.length > 0) {
        if (token === getData[0].remember_key) {
          const update_query = `UPDATE users SET password = '${dcryptPass(
            password
          )}' WHERE email = '${email}'`;
          const forgot_pass_key = `UPDATE users SET remember_key = '${require("crypto")
            .randomBytes(20)
            .toString("hex")}' WHERE email = '${email}'`;
          await createUpdateDelete(update_query);
          await createUpdateDelete(forgot_pass_key);
          res.render("login/reset-pass", {
            path: "/login",
            title: "Password Reset Successful",
            isLogged: req.isLogged,
            isAdmin: req.isAdmin,
            mail: email,
            errorMsg: "",
            token,
            successMsg: "Password Reset Successful",
          });
        } else {
          res.render("login/reset-pass", {
            path: "/login",
            title: "Error!",
            isLogged: req.isLogged,
            isAdmin: req.isAdmin,
            token,
            mail: email,
            errorMsg: "Error occured!",
            successMsg: "",
          });
        }
      } else {
        res.render("login/reset-pass", {
          path: "/login",
          title: "Email Not Found",
          isLogged: req.isLogged,
          isAdmin: req.isAdmin,
          token,
          mail: email,
          errorMsg: "Email Not Found",
          successMsg: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  renderLogin,
  doLogin,
  renderForgotPass,
  searchEmail,
  sendEmail,
  renderResetPass,
  doResetPass,
};
