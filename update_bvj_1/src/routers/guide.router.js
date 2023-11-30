const express = require('express');
const { renderGuide } = require('../controllers/guide/guide.controller');
const guideRouter = express.Router();

guideRouter.get('', renderGuide);


module.exports = guideRouter;