const express = require('express');
const { renderContact } = require('../controllers/contact/contact.controller');
const contactRouter = express.Router();

contactRouter.get('', renderContact);


module.exports = contactRouter;