const express = require('express');
const { renderCompletedPaperReviewer, completedPaperListReviewer } = require('../../controllers/reviewer/completed_paper.controller');
const completedPaperRouterReviewer = express.Router();
const ejs = require('ejs');
const pdf = require('html-pdf');
const { readData } = require('../../helper/PromiseModule');

completedPaperRouterReviewer.get('', renderCompletedPaperReviewer);



/* @GET/@POST for api */
completedPaperRouterReviewer.get('/list', completedPaperListReviewer);
completedPaperRouterReviewer.get('/certificate', async (req, res) => {
  const { id, first_name, middle_name, last_name } = req.decode_data;
  const name = `${first_name}${middle_name.length > 0 ? ` ${middle_name}` : ''} ${last_name}`;
  const revData = await readData(`SELECT total_review FROM reviewers WHERE id = ${id}`);
  const total_review = revData[0].total_review;
  try { 
    ejs.renderFile('./src/views/reviewer-panel/certificate/index.ejs', { reviewer: name, total_review }, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        let options = {
          "height": "5.8in",
          "width": "6in",
          "header": {
            "height": "0mm"
          },
          "footer": {
            "height": "0mm",
          },
          "border" : {
            "top": "10mm",
            "bottom": "10mm",
            "left": "10mm",
            "right": "10mm"
          }
        };
        pdf.create(data, options).toFile(`public/certificate/rev-${id}-cert.pdf`, function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.sendFile(data.filename);
          }
        });
      }
    });
  } catch(error) { 
    console.log(error)
  }
});

module.exports = completedPaperRouterReviewer;

