const { readData } = require("../../helper/PromiseModule");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");

const renderEditorial = async (req, res) => {
  const recentPapers = getRecentPublishedPapers(10);
  const pageData = readData(`SELECT page_data_html FROM page_data WHERE page_name = 'editorial_board'`);

  const result = await Promise.all([
    recentPapers,
    pageData
  ])
  const html = result[1][0].page_data_html || '';

  res.render('editorial', {
    path: '/editorial',
    title: 'Editorial Board',
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: result[0],
    html
  });
}

module.exports = {
  renderEditorial
}