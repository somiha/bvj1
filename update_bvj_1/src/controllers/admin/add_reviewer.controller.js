const countryList = require("../../enums/AllCountries");
const dcryptPass = require("../../helper/DcryptPassword");
const forgotPassKey = require("../../helper/ForgotPassKey");
const { reviewer_welcome_mail } = require("../../config/nodemailer.config");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");

const renderAddReviewer = (req, res) => {
  res.render("admin-panel/add-reviewer", {
    path: "/add_reviewer",
    user: "",
    title: "Add Reviewer",
    countryList: countryList,
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
};

const doAddReviewer = async (req, res) => {
  try {
    const first_name = req.body.first_name || "";
    const middle_name = req.body.middle_name || "";
    const last_name = req.body.last_name || "";
    const email = req.body.email || "";
    const country = req.body.country || "";
    const password = req.body.password || "";
    const affiliation = req.body.affiliation || "";

    const select_query = `SELECT id FROM reviewers WHERE email = '${email}'`;
    const result = await readData(select_query);
    if (result.length > 0) {
      res.send({
        success: false,
        message: "Email already exists",
      });
    } else {
      const insert_query = `INSERT INTO reviewers SET ?`;
      const value = {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        email: email,
        country: country,
        password: dcryptPass(password),
        affiliation: affiliation,
        remember_key: forgotPassKey.encode(),
      };
      await createUpdateDelete(insert_query, value);
      reviewer_welcome_mail(first_name, email, password);
      res.send({
        success: true,
        message: "Reviewer added successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  renderAddReviewer,
  doAddReviewer,
};
