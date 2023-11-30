const express = require('express');
const { renderVolumesAdmin } = require('../../controllers/admin/volumes.controller');
const { apiVolumeList, apiAddPaper } = require('../api/api.controller');
const volumesAdminRouter = express.Router();

volumesAdminRouter.get('', renderVolumesAdmin);
volumesAdminRouter.get('/list', apiVolumeList);
volumesAdminRouter.post('/add-paper', apiAddPaper);

module.exports = volumesAdminRouter;

