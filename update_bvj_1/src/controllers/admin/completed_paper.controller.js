const renderCompletedPaper = (req, res) => {
  res.render('admin-panel/completed-paper', {
    path: '/completed_paper',
    user: '',
    title: 'Completed Paper',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  })
}

module.exports = {
  renderCompletedPaper
}