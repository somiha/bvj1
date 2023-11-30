const { renderSiteManager, renderEditSiteManager, doEditSiteManager } = require("../../controllers/admin/site_manager.controller");

const siteManagerRouter = require('express').Router();

siteManagerRouter.get('', renderSiteManager);
siteManagerRouter.get('/edit/:pageName', renderEditSiteManager);
siteManagerRouter.post('/edit/:pageName', doEditSiteManager);

module.exports = siteManagerRouter;