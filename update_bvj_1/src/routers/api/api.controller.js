const {
  reviewer_mail,
  author_paper_update,
} = require("../../config/nodemailer.config");
const { COMPLETED, REJECTED } = require("../../enums/paperCheckpoints");
const { createUpdateDelete, readData } = require("../../helper/PromiseModule");
const deleteUploadedFile = require("../../helper/deleteUploadedFile");

async function apiDoUpdateReviewer(req, res) {
  try {
    const id = req.params.id;
    const query = `UPDATE reviewers SET ? WHERE id = ${id}`;
    const value = { ...req.body };
    await createUpdateDelete(query, value);
    res.json({
      success: true,
      message: "Reviewer updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiSearchReviewer(req, res) {
  const search_query = req.query.q;
  if (!search_query)
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  const query = `SELECT id, first_name, middle_name, last_name, email, affiliation, country FROM reviewers WHERE email = '${search_query}'`;
  try {
    const result = await readData(query);
    res.json({
      success: result[0] ? true : false,
      data: result[0] ? result[0] : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiReviewerList(req, res) {
  try {
    const paper_id = req.query.paper_id;
    const query = `SELECT *, 
                      CASE WHEN EXISTS (SELECT * FROM paper_reviewer WHERE paper_id = ${paper_id} AND paper_reviewer.reviewer_id = reviewers.id) 
                      THEN true 
                      ELSE false 
                      END AS isAssigned
                    FROM reviewers;`;
    const result = await readData(query);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiAssignReviewer(req, res) {
  try {
    const { reviewerId, paperId } = req.body;
    const query = `SELECT * FROM reviewers WHERE id = ${reviewerId}`;
    const insert_query = `INSERT INTO paper_reviewer SET ?`;
    const value = {
      paper_id: paperId,
      reviewer_id: reviewerId,
    };
    await createUpdateDelete(insert_query, value);
    const result = await readData(query);

    await reviewer_mail(result[0].first_name, reviewerId, result[0].email);

    res.send({
      success: true,
      message: "Reviewer assigned successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiSearchPaper(req, res) {
  try {
    const search_query = parseInt(req.query.q);
    if (!search_query)
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    const query = `SELECT *, paper_info.id as paper_id FROM paper_info WHERE paper_info.id=${search_query} AND checkpoint = ${COMPLETED};`;
    const result = await readData(query);
    res.json({
      success: result[0] ? true : false,
      data: result[0] ? result[0] : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

const apiSearchAuthor = async (req, res) => {
  try {
    const search_query = req.query.q;
    if (!search_query)
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    const query = `SELECT * FROM users WHERE email = '${search_query}';`;
    const result = await readData(query);
    res.json({
      success: result[0] ? true : false,
      data: result[0] ? result[0] : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const apiAddVolume = async (req, res) => {
  try {
    const position = await readData(
      `SELECT IFNULL(MAX(position), -1) as position FROM volumes`
    );
    const index = parseInt(position[0].position);
    const query = `INSERT INTO volumes SET title = '${
      req.body.title
    }', position = ${index + 1};`;
    await createUpdateDelete(query);
    res.json({
      success: true,
      message: "Volume added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

async function apiVolumeList(req, res) {
  try {
    const query = `SELECT * FROM volumes ORDER BY position ASC;`;
    const result = await readData(query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiMovePosition(req, res) {
  try {
    const method = parseInt(req.body.method);
    const id = parseInt(req.body.id);
    const position = parseInt(req.body.position);

    const maxPosition = await readData(
      `SELECT IFNULL(MAX(position), 0) as position FROM volumes`
    );
    const max = parseInt(maxPosition[0].position);

    if (method === 1 && parseInt(position) >= max) {
      return res.status(400).json({
        success: false,
        message: "Volume is already at the bottom",
      });
    }

    if (method === 0 && parseInt(position) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Volume is already at the top",
      });
    }

    if (method === 0) {
      const query = `UPDATE volumes SET position = position - 1 WHERE position = ${position}`;
      const query2 = `UPDATE volumes SET position = position + 1 WHERE position = ${
        position - 1
      } AND id <> ${id}`;
      await createUpdateDelete(query);
      await createUpdateDelete(query2);
    }

    if (method === 1) {
      const query = `UPDATE volumes SET position = position + 1 WHERE position = ${position}`;
      const query2 = `UPDATE volumes SET position = position - 1 WHERE position = ${
        position + 1
      } AND id <> ${id}`;
      await createUpdateDelete(query);
      await createUpdateDelete(query2);
    }
    res.json({
      success: true,
      message: "Volume moved up successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiEditVolume(req, res) {
  try {
    const id = req.body.id;
    let title = req.body.title;
    title = title.replace(/'/g, "\\'").replace(/"/g, '\\"');
    if (!id && !title) {
      return res.status(400).json({
        success: false,
        message: "Id and title is required",
      });
    }
    const query = `UPDATE volumes SET title = '${title}' WHERE id = ${id}`;
    await createUpdateDelete(query);
    res.json({
      success: true,
      message: "Volume edited successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiDeleteVolume(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    // const query2 = `UPDATE volumes SET position = position - 1 WHERE position > (SELECT position FROM volumes WHERE id = ${id})`;
    const query2 = `
  UPDATE volumes AS v1
  JOIN (SELECT position FROM volumes WHERE id = ${id}) AS v2
  ON v1.position > v2.position
  SET v1.position = v1.position - 1
`;
    await createUpdateDelete(query2);

    const query = `DELETE FROM volumes WHERE id = ${id}`;
    await createUpdateDelete(query);

    res.json({
      success: true,
      message: "Volume deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiAddPaper(req, res) {
  try {
    const { paper_id, volume_id, page } = req.body;
    if (!(paper_id.length > 0) || !(volume_id.length > 0) || !(page.length > 0))
      return res.status(400).json({
        success: false,
        message: "Paper id and volume id is required",
      });
    const query = `UPDATE paper_info SET checkpoint = ${COMPLETED}, volume = ${volume_id}, page= '${page}' WHERE id = ${paper_id}`;
    await createUpdateDelete(query);
    author_paper_update(paper_id, false, "Your Paper Has Been Published");
    res.json({
      success: true,
      message: "Paper added to volume successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

async function apiAuthorSearch(req, res) {
  try {
    const { q } = req.query;

    const select_query = `SELECT * FROM paper_author WHERE paper_author.email = '${q}'`;
    const result = await readData(select_query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
}

async function apiPaperCompleted(req, res) {
  try {
    const select_query = `SELECT *, volumes.title as volume_title, paper_info.title AS title,
                          (
                            SELECT GROUP_CONCAT(SUBSTR(first_name, 1, 1), SUBSTR(middle_name, 1, 1), ' ', last_name SEPARATOR ', ')
                            FROM paper_author AS table1
                            WHERE paper_info.id = table1.paper_id
                          ) AS paper_author FROM paper_info
                          INNER JOIN paper_file
                            ON paper_info.id = paper_file.paper_id
                          INNER JOIN volumes 
                            ON paper_info.volume = volumes.id
                          WHERE paper_info.checkpoint = ${COMPLETED}
                          ORDER BY paper_info.id DESC`;
    const result = await readData(select_query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
}

async function apiUpdateArticleAuthor(req, res) {
  try {
    const {
      paper_id,
      first_name,
      is_corresponding,
      middle_name,
      last_name,
      email,
      affiliation,
      country,
    } = req.body;

    const checkIfExist = `SELECT paper_author.id as author_id, first_name, middle_name, last_name, email, paper_info.id as paper_id FROM paper_author INNER JOIN paper_info ON paper_info.id = paper_author.paper_id WHERE paper_id = ${paper_id}`;
    const result = await readData(checkIfExist);

    if (result.find((item) => item.email === email)) {
      return res.json({
        success: false,
        message: "This author already added",
        data: result,
      });
    }
    const insert_query = `INSERT INTO paper_author (paper_id, is_corresponding, first_name, middle_name, last_name, email, affiliation, country) VALUES (${paper_id}, ${
      is_corresponding ? 1 : 0
    }, '${first_name}', '${middle_name}', '${last_name}', '${email}', '${affiliation}', '${country}');`;
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
}

async function apiUpdateArticlePaperInfo(req, res) {
  try {
    const { paper_id, values } = req.body;
    const update_query = `UPDATE paper_info SET ? WHERE id = ${paper_id}`;
    await createUpdateDelete(update_query, values);
    res.send({
      success: true,
      message: "Article paper info updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

async function apiAuthorSearchAndUpdate(req, res) {
  try {
    const { q } = req.query;
    const select_query = `SELECT * FROM paper_author WHERE paper_author.email = '${q}'`;
    const result = await readData(select_query);
    if (result.length > 0) {
      let {
        paper_id,
        first_name,
        middle_name,
        last_name,
        email,
        affiliation,
        country,
        is_corresponding,
      } = result[0];

      first_name = first_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
      middle_name = middle_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
      last_name = last_name.replace(/'/g, "\\'").replace(/"/g, '\\"');
      email = email.replace(/'/g, "\\'").replace(/"/g, '\\"');
      affiliation = affiliation.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const insert_query = `INSERT INTO paper_author SET paper_id = ${paper_id}, first_name = '${first_name}', middle_name = '${middle_name}', last_name = '${last_name}', email = '${email}', affiliation = '${affiliation}', country = '${country}', is_corresponding = ${is_corresponding}`;
      await createUpdateDelete(insert_query);
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// async function apiAuthorSearchAndUpdate(req, res) {
//   try {
//     const { q } = req.query;
//     console.log({ q });

//     // Use parameterized query to prevent SQL injection
//     const select_query = `SELECT * FROM paper_author WHERE paper_author.email = ?`;
//     const result = await readDataAsync(select_query, [q]);

//     if (result.length > 0) {
//       const {
//         paper_id,
//         first_name,
//         middle_name,
//         last_name,
//         email,
//         affiliation,
//         country,
//         is_corresponding,
//       } = result[0];

//       // Use parameterized query to prevent SQL injection
//       const insert_query = `INSERT INTO paper_author SET paper_id = ?, first_name = ?, middle_name = ?, last_name = ?, email = ?, affiliation = ?, country = ?, is_corresponding = ?`;
//       await createUpdateDeleteAsync(insert_query, [
//         paper_id,
//         first_name,
//         middle_name,
//         last_name,
//         email,
//         affiliation,
//         country,
//         is_corresponding,
//       ]);

//       res.json({
//         success: true,
//       });
//     } else {
//       res.json({
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error("Error in apiAuthorSearchAndUpdate:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }

async function apiUploadFile(req, res) {
  try {
    const { paper_id } = req.params;
    const { file } = req;

    const select_query = `SELECT file_url FROM paper_file WHERE paper_id = ${paper_id}`;
    const file_url = await readData(select_query);

    try {
      if (file_url.length > 0) {
        deleteUploadedFile(file_url[0].file_url);
      }
    } catch (error) {
      console.log(error);
    }
    const fileType = file.filename.split(".");

    const query2 = `UPDATE paper_file SET file_url = '${
      file.filename
    }', file_type = '${
      fileType[fileType.length - 1]
    }' WHERE paper_id = ${paper_id}`;
    await createUpdateDelete(query2);

    res.send({
      success: true,
      message: "File Uplaoded Successfully",
    });
  } catch (error) {
    deleteUploadedFile(req.file.filename);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

async function apiAuthorDeletePaper(req, res) {
  try {
    const { paper_id } = req.body;
    const select_query = `SELECT file_url FROM paper_file INNER JOIN paper_info ON paper_info.id = paper_file.paper_id WHERE paper_id = ${paper_id} AND user_id = ${req.decode_data.id}`;
    const file_url = await readData(select_query);
    if (file_url.length > 0) {
      deleteUploadedFile(file_url[0].file_url);
    } else {
      return res.json({
        success: false,
        message: "Access Denied!",
      });
    }
    const query = `DELETE FROM paper_info WHERE id = ${paper_id} AND user_id = ${req.decode_data.id}`;
    const query1 = `DELETE FROM paper_file WHERE paper_id = ${paper_id}`;
    await createUpdateDelete(query);
    await createUpdateDelete(query1);
    res.json({
      success: true,
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiAdminDeletePaper(req, res) {
  try {
    const { paper_id } = req.body;
    console.log({ paper_id });
    const select_query = `SELECT file_url FROM paper_file WHERE paper_id = ${paper_id}`;
    const file_url = await readData(select_query);
    await deleteUploadedFile(file_url[0].file_url);
    const query = `DELETE FROM paper_info WHERE id = ${paper_id}`;
    await createUpdateDelete(query);
    const query1 = `DELETE FROM paper_file WHERE paper_id = ${paper_id}`;
    await createUpdateDelete(query1);
    res.json({
      success: true,
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiGetReview(req, res) {
  try {
    const { paper_id } = req.params;
    const select_query = `SELECT CONCAT(SUBSTR(reviewers.first_name, 1, 1), SUBSTR(reviewers.middle_name, 1, 1), ' ', reviewers.last_name) as reviewer, files_url, comment FROM paper_review INNER JOIN reviewers ON paper_review.reviewer_id = reviewers.id WHERE paper_id = ${paper_id}`;
    const result = await readData(select_query);
    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.log(error);
  }
}

async function apiAdminRejectPaper(req, res) {
  try {
    const { paper_id } = req.body;
    const update_query = `UPDATE paper_info SET checkpoint = ${REJECTED} WHERE id = ${paper_id}`;
    await createUpdateDelete(update_query);
    res.json({
      success: true,
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function apiDeleteAuthor(req, res) {
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
}

module.exports = {
  apiDoUpdateReviewer,
  apiSearchReviewer,
  apiReviewerList,
  apiAssignReviewer,
  apiSearchPaper,
  apiAddVolume,
  apiVolumeList,
  apiMovePosition,
  apiEditVolume,
  apiDeleteVolume,
  apiAddPaper,
  apiAuthorSearch,
  apiPaperCompleted,
  apiUpdateArticleAuthor,
  apiUpdateArticlePaperInfo,
  apiAuthorSearchAndUpdate,
  apiUploadFile,
  apiAdminDeletePaper,
  apiGetReview,
  apiAuthorDeletePaper,
  apiAdminRejectPaper,
  apiDeleteAuthor,
  apiSearchAuthor,
};
