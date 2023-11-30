const upload = require('../../config/multer.config');
const { renderAddEditorial, doAddEditorial, renderViewEditorial, renderViewEditorialById, renderEditorialsByVolId, deleteEditorialById } = require('../../controllers/admin/editorial.controller');

const addEditorialRouter = require('express').Router();

addEditorialRouter.get('/view', renderViewEditorial);
addEditorialRouter.get('/view/:volume_id', renderEditorialsByVolId);

addEditorialRouter.get('/add', renderAddEditorial);
addEditorialRouter.post('/add', upload.single('file'), doAddEditorial);

addEditorialRouter.get('/delete/:editorial_id', deleteEditorialById);

addEditorialRouter.get('/:editorial_id', renderViewEditorialById);


module.exports = addEditorialRouter;