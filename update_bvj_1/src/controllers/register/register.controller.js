const { AUTHOR } = require("../../enums/userRole");
const dcryptPass = require("../../helper/DcryptPassword");
const forgotPassKey = require("../../helper/ForgotPassKey");
const { createUpdateDelete, readData } = require("../../helper/PromiseModule");
const { send_welcome_mail } = require("../../config/nodemailer.config");

const renderRegister = (req, res) => {
  try {
    if (req.isLogged) {
      res.redirect("/");
    } else {
      res.render("register", {
        path: "/register",
        title: "Registration",
        isLogged: req.isLogged,
        isAdmin: req.isAdmin,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const checkEmailExist = async (email) => {
  const query = `SELECT email FROM users WHERE email='${email}'`;
  const data = await readData(query);
  if (data[0]) {
    //false if the email exists;
    return false;
  } else {
    //true if the email does not exist;
    return true;
  }
};

const processReg = async (
  first_name,
  middle_name,
  last_name,
  email,
  password
) => {
  if (first_name && last_name && email && password) {
    const query = `INSERT INTO users SET ?`;
    const value = {
      first_name,
      last_name,
      middle_name,
      email,
      password: dcryptPass(password),
      role: AUTHOR,
      remember_key: forgotPassKey.encode(),
    };
    try {
      await createUpdateDelete(query, value);
      send_welcome_mail(first_name, email);
      return { success: true, message: "Registration Successful!" };
    } catch (error) {
      console.log(error);
    }
  } else {
    return { success: false, message: "Please fill all fields." };
  }
};

/* @POST request for registration */
const doRegister = async (req, res) => {
  const { first_name, last_name, middle_name, email, password } = req.body;
  if (await checkEmailExist(email)) {
    res.send(
      await processReg(first_name, middle_name, last_name, email, password)
    );
  } else {
    res.send({ success: false, message: "This email is already Registered!" });
  }
};

module.exports = {
  renderRegister,
  doRegister,
};
