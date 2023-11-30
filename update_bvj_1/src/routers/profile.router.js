const { renderAuthorProfile, doEditAuthorProfile, doChangeAuthorPass } = require('../controllers/profile/profile.controller');

const profileRouter = require('express').Router();

profileRouter.get('', renderAuthorProfile);
profileRouter.post('', doEditAuthorProfile);
profileRouter.post('/change_password', doChangeAuthorPass);

module.exports = profileRouter;