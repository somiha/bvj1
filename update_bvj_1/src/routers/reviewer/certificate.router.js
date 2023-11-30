const certRouter = require("express").Router();

certRouter.get("", (req, res) => {
  res.send("Certificate");
});

certRouter.get("/download", (req, res) => {
  res.download("./public/uploads/certificates/1.pdf");
});

module.exports = certRouter;
