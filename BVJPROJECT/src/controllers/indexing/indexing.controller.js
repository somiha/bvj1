const { readData } = require("../../helper/PromiseModule");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");

const renderIndexing = async (req, res) => {
  const recentPapers = getRecentPublishedPapers(3);
  const pageData = readData(`SELECT page_data_html FROM page_data WHERE page_name = 'indexing'`);

  const result = await Promise.all([
    recentPapers,
    pageData
  ])
  const html = result[1][0].page_data_html || '';
  res.render('indexing', {
    title: "Indexing",
    path: "/indexing",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    recentPapers: result[0], html
  })
}

module.exports = {
  renderIndexing
}