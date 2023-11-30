const countryList = require("../../enums/AllCountries")

const renderUpdateReviewer = (req, res) => {
  res.render('admin-panel/update-reviewer', {
    path: '/update_reviewer',
    user: '',
    title: 'Update Reviewer',
    countryList: countryList,
    isLogged: req.isLogged,
    isAdmin: req.isAdmin
  })
}

module.exports = {
  renderUpdateReviewer
}