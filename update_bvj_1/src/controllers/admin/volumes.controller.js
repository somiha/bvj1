const renderVolumesAdmin = (req, res) => {
  res.render('admin-panel/volumes', {
    path: '/volumes',
    user: '',
    title: 'Volumes',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  })
}

module.exports = {
  renderVolumesAdmin
}