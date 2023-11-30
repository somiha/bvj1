const { QuillDeltaToHtmlConverter } = require("quill-delta-to-html");
const { createUpdateDelete, readData } = require("../../helper/PromiseModule");

const renderSiteManager = (req, res) => {
  res.render("admin-panel/site-manager", {
    title: "Website Manager",
    path: "/site_manager",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
};

const renderEditSiteManager = async (req, res) => {
  const pageName = req.params.pageName;
  try {
    const sqlQuery = `SELECT * FROM page_data WHERE page_name = '${pageName}'`;
    const pageData = await readData(sqlQuery);
    const html = pageData[0].page_data_html || "";
    res.render("admin-panel/site-manager/editor", {
      editPath: pageName,
      title: "Edit Page Information",
      path: "/site_manager",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

const doEditSiteManager = async (req, res) => {
  const pageName = req.params.pageName;
  const { page_data_json } = req.body;
  try {
    const json = JSON.parse(page_data_json);
    const converter = new QuillDeltaToHtmlConverter(json.ops, {});
    const html = converter.convert();
    const value = {
      page_data_html: html,
      page_data_json: page_data_json,
    };
    const sqlQuery = `UPDATE page_data SET ? WHERE page_name = '${pageName}'`;
    await createUpdateDelete(sqlQuery, value);
    res.send({
      success: true,
      message: "Saved Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.toString(),
    });
  }
};

module.exports = {
  renderSiteManager,
  renderEditSiteManager,
  doEditSiteManager,
};
