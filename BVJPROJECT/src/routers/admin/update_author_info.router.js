const express = require('express');
const { renderUpdateAuthorInfo, doUpdateAuthorInfoAdmin } = require('../../controllers/admin/update_author_info.controller');
const updateAuthorInfoRouter = express.Router();

updateAuthorInfoRouter.get('', renderUpdateAuthorInfo);
updateAuthorInfoRouter.post('', doUpdateAuthorInfoAdmin);

module.exports = updateAuthorInfoRouter;

