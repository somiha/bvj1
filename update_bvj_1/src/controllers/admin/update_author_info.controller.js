const { createUpdateDelete } = require("../../helper/PromiseModule");

const renderUpdateAuthorInfo = (req, res) => {
  res.render("admin-panel/update-author-info", {
    path: "/update_author_info",
    user: "",
    title: "Update Author Info",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
  });
};

const doUpdateAuthorInfoAdmin = async (req, res) => {
  const id = req.body.id;
  try {
    const value = {
      ...req.body,
    };
    delete value.id;
    const update_query = `UPDATE users SET ? WHERE id = ${id}`;
    await createUpdateDelete(update_query, value);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

module.exports = {
  renderUpdateAuthorInfo,
  doUpdateAuthorInfoAdmin,
};
