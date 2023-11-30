const { readData } = require("../../helper/PromiseModule");

const renderHome = async (req, res) => {
  if (req.isLogged) {
    if (req.isAdmin) {
      return res.redirect("/admin_panel");
    }
    if (req.isReviewer) {
      return res.redirect("/reviewer_panel");
    }
  }
  const homeData = readData(
    `SELECT page_data_html FROM page_data WHERE page_name = 'home'`
  );
  const result = await Promise.all([homeData]);
  const html = result[0][0].page_data_html || "";
  return res.render("home", {
    title: "Bangladesh Veterinary Journal",
    path: "/home",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    html: html,
  });
};

module.exports = {
  renderHome,
};
