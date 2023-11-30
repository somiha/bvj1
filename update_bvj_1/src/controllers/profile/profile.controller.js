const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const bcrypt = require("bcryptjs");

const renderAuthorProfile = async (req, res) => {
  const userId = req.decode_data.id;
  const select_query = `SELECT * FROM users WHERE id = ${userId}`;
  const data = readData(select_query);
  const result = await data;
  res.render("profile", {
    title: "Profile",
    path: "/profile",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    user: req.user,
    profile: result[0],
  });
};

const doEditAuthorProfile = async (req, res) => {
  try {
    const userId = req.decode_data.id;
    const update_query = `UPDATE users SET ? WHERE id = ${userId}`;
    await createUpdateDelete(update_query, req.body);
    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const doChangeAuthorPass = async (req, res) => {
  try {
    const userId = req.decode_data.id;
    const { oldPass, newPass } = req.body;

    if (!oldPass || !newPass) {
      return res.json({
        success: false,
        message: "Please fill up all the fields",
      });
    }

    const select_query = `SELECT * FROM users WHERE id = ${userId}`;
    const data = readData(select_query);
    const result = await data;
    const user = result[0];

    bcrypt.compare(oldPass, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.json({
          success: false,
          message: "Old password is not correct",
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPass, salt, (err, hash) => {
            if (err) throw err;
            const update_query = `UPDATE users SET password = '${hash}' WHERE id = ${userId}`;
            createUpdateDelete(update_query);
            res.json({
              success: true,
              message: "Password changed successfully",
            });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  renderAuthorProfile,
  doEditAuthorProfile,
  doChangeAuthorPass,
};
