const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const bcrypt = require('bcryptjs');

const renderReviewerProfile = async (req, res) => {
  try { 
    const userId = req.decode_data.id;
    const select_query = `SELECT * FROM reviewers WHERE id = ${userId}`;
    const data = readData(select_query);
    const result = await data;
    console.log(result)
    res.render('reviewer-panel/reviewer_profile', {
      title: 'Profile',
      path: '/reviewer_profile',
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      profile: result[0]
    });
  } catch(error) { 
    console.log(error)
  }
}

const doEditReviewerProfile = async (req, res) => {
  try { 
    const userId = req.decode_data.id;
    const update_query = `UPDATE reviewers SET ? WHERE id = ${userId}`;
    createUpdateDelete(update_query, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch(error) { 
    console.log(error)
  }
}

const doChangeReviewerPass = async (req, res) => {
  try { 
    const userId = req.decode_data.id;
    const { oldPass, newPass } = req.body;
    if(!oldPass || !newPass) {
      return res.json({
        success: false,
        message: 'Please fill up all the fields'
      });
    }

    const select_query = `SELECT * FROM reviewers WHERE id = ${userId}`;
    const data = readData(select_query);
    const result = await data;
    const user = result[0];

    bcrypt.compare(oldPass, user.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) {
        return res.json({
          success: false,
          message: 'Old password is not correct'
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPass, salt, (err, hash) => {
            if(err) throw err;
            const update_query = `UPDATE reviewers SET password = '${hash}' WHERE id = ${userId}`;
            createUpdateDelete(update_query);
            res.json({
              success: true,
              message: 'Password changed successfully'
            });
          });
        });
      }
    });
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderReviewerProfile,
  doEditReviewerProfile,
  doChangeReviewerPass
}