const express = require('express');
const { renderEditorial } = require('../controllers/editorial/editorial.controller');
const editorialRouter = express.Router();

editorialRouter.get('', renderEditorial);


module.exports = editorialRouter;