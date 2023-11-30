const db = require("../../config/database.config");
const countryList = require("../../enums/AllCountries");
const {
  ADD_AUTHOR,
  UPLOAD_FILE,
  SUBMITTED,
  COMPLETED,
} = require("../../enums/paperCheckpoints");
const { readData, createUpdateDelete } = require("../../helper/PromiseModule");
const deleteUploadedFile = require("../../helper/deleteUploadedFile");
const getRecentPublishedPapers = require("../../helper/getRecentPublishedPapers");

const renderAddOldArticle = async (req, res) => {
  const types_query = `SELECT id, type FROM paper_types ORDER BY id ASC`;
  const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;

  const data = [readData(types_query), readData(volumes_query)];

  const result = await Promise.all(data);

  res.render("admin-panel/add-old-article", {
    path: "/add_old_article/",
    user: "",
    title: "Add Old Article",
    countryList: countryList,
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    types: result[0],
    volumes: result[1],
  });
};

// const doAddOldArticle = async (req, res) => {
//   try {
//     const dataObj = {
//       ...req.body,
//       checkpoint: ADD_AUTHOR,
//     };
//     const insert_query = `INSERT INTO paper_info SET ?`;
//     await createUpdateDelete(insert_query, dataObj);
//     res.redirect(`/admin_panel/add_old_article/${req.body.id}/add-author`);
//   } catch (error) {
//     res.redirect("/error");
//   }
// };

const doAddOldArticle = async (req, res) => {
  try {
    const dataObj = {
      ...req.body,
      checkpoint: ADD_AUTHOR,
    };
    const insert_query = `INSERT INTO paper_info SET ?`;
    await createUpdateDelete(insert_query, dataObj);
    res.redirect(`/admin_panel/add_old_article/${req.body.id}/add-author`);
  } catch (error) {
    if (error.message) {
      const duplicateKeyMessage = error.message;

      res.status(400).send(duplicateKeyMessage);
    } else {
      res.redirect("/error");
    }
  }
};

const renderAddAuthorAdmin = async (req, res) => {
  const { paper_id } = req.params;
  const msg = req.query.msg || "";
  try {
    var alreadyAddedAuthors = await readData(
      `SELECT first_name, middle_name, last_name, email, paper_author.id as id, paper_info.id as paper_id FROM paper_author INNER JOIN paper_info ON paper_info.id = paper_author.paper_id WHERE paper_id = ${paper_id}`
    );
    // alreadyAddedAuthors = await alreadyAddedAuthors;
    res.render("admin-panel/add-old-article/add-author", {
      title: "Add author info",
      path: "/add_old_article",
      user: "",
      isLogged: req.isLogged,
      paper_id: req.params.paper_id,
      isAdmin: req.isAdmin,
      paperId: req.params.paper_id,
      alreadyAddedAuthors,
      msg,
    });
  } catch (error) {
    console.log(error);
  }
};

const apiDoAddAuthorAdmin = async (req, res) => {
  try {
    let {
      paper_id,
      first_name,
      is_corresponding,
      middle_name,
      last_name,
      email,
      affiliation,
      country,
    } = req.body;
    first_name = first_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
    middle_name = middle_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
    last_name = last_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
    email = email.replace(/'/g, "\\'").replace(/"/g, '\\"');
    affiliation = affiliation.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const checkIfExist = `SELECT id, first_name, middle_name, last_name, email FROM paper_author WHERE paper_id = ${paper_id}`;
    const result = await readData(checkIfExist);

    if (result.find((item) => item.email === email)) {
      return res.json({
        success: false,
        message: "This author already added",
        data: result,
      });
    }
    const insert_query = `INSERT INTO paper_author (paper_id, is_corresponding, first_name, middle_name, last_name, email, affiliation, country) VALUES (${paper_id}, ${is_corresponding}, '${first_name}', '${middle_name}', '${last_name}', '${email}', '${affiliation}', '${country}');`;
    const insertResult = await createUpdateDelete(insert_query);
    res.json({
      success: true,
      message: "Author added successfully",
      data: [
        ...result,
        {
          id: insertResult.insertId,
          first_name,
          middle_name,
          last_name,
          email,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const apiDeleteAuthorAdmin = async (req, res) => {
  try {
    const { paper_id, author_id } = req.body;
    const delete_query = `DELETE FROM paper_author WHERE paper_id = ${paper_id} AND id = ${author_id}`;
    await createUpdateDelete(delete_query);
    const select_query = `SELECT id, first_name, middle_name, last_name, email FROM paper_author WHERE paper_id = ${paper_id}`;
    const data = await readData(select_query);
    res.send({
      success: true,
      message: "Deleted Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const doAddAuthorAdmin = async (req, res) => {
  const { paper_id } = req.params;
  try {
    var authorList = await readData(
      `SELECT id FROM paper_author WHERE paper_id = ${paper_id}`
    );

    var corresponding_author = await readData(
      `SELECT id FROM paper_author WHERE paper_id = ${paper_id} AND is_corresponding = 1`
    );

    authorList = await authorList;
    corresponding_author = await corresponding_author;

    if (authorList[0]) {
      if (corresponding_author[0]) {
        const update_checkpoint_query = `UPDATE paper_info SET checkpoint = '${UPLOAD_FILE}' WHERE id = ${paper_id}`;
        await createUpdateDelete(update_checkpoint_query);
        res.redirect(`/admin_panel/add_old_article/${paper_id}/upload-file`);
      } else {
        res.redirect(
          `/admin_panel/add_old_article/${paper_id}/add-author?msg=${encodeURIComponent(
            "Please Add a Corresponding Author For This Paper."
          )}`
        );
      }
    } else {
      res.redirect(
        `/admin_panel/add_old_article/${paper_id}/add-author?msg=${encodeURIComponent(
          "Please Add One or More Author For This Paper."
        )}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const renderUploadFileAdmin = async (req, res) => {
  try {
    const { paper_id } = req.params;
    res.render("admin-panel/add-old-article/upload-file", {
      title: "Upload file for your paper",
      path: "/add_old_article",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      paper_id,
    });
  } catch (error) {
    console.log(error);
  }
};

const doUploadFileAdmin = async (req, res) => {
  try {
    const { paper_id } = req.params;
    const { file } = req;
    const fileType = file.filename.split(".");
    const query1 = `UPDATE paper_info SET checkpoint = '${COMPLETED}' WHERE id = ${paper_id}`;
    const query2 = `INSERT INTO paper_file SET paper_id = ${paper_id}, file_url = '${
      file.filename
    }', file_type = '${fileType[fileType.length - 1]}'`;

    db.beginTransaction(function (err) {
      if (err) throw err;
      db.query(query1, function (err, result) {
        if (err) {
          return db.rollback(function () {
            throw err;
          });
        }
      });

      db.query(query2, function (err, result) {
        if (err) {
          return db.rollback(function () {
            throw err;
          });
        }
        db.commit(function (err) {
          if (err) {
            deleteUploadedFile(req.file.filename);
            return db.rollback(function () {
              throw err;
            });
          }
          res.status(200).json({ message: "File uploaded successfully" });
        });
      });
    });
  } catch (error) {
    deleteUploadedFile(req.file.filename);
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  renderAddOldArticle,
  doAddOldArticle,
  renderAddAuthorAdmin,
  apiDoAddAuthorAdmin,
  apiDeleteAuthorAdmin,
  doAddAuthorAdmin,
  renderUploadFileAdmin,
  doUploadFileAdmin,
};
