const express = require('express');
const articlesRouter = require('./articles.router');
const contactRouter = require('./contact.router');
const editorialRouter = require('./editorial.router');
const guideRouter = require('./guide.router');
const indexingRouter = require('./indexing.router');
const indexRouter = require('./indexRouter');
const loginRouter = require('./login.router');
const registrationRouter = require('./registration.router');
const submitRouter = require('./submit.router');
const trackRouter = require('./track.router');
const adminPanelRouter = require('./admin/allAdminRouters');
const { EDITORIAL } = require('../enums/definedRoutes');
const isLogged = require('../middlewares/checkIsLogged.middleware');
const logoutRouter = require('./logout.router');
const isAdmin = require('../middlewares/isAdmin.middleware');
const apiRouter = require('./api/api.index');
const reviewerRouter = require('./reviewer');
const profileRouter = require('./profile.router');
const Router = express.Router();

// Router.get('/test', async (req, res) => {
//  const { readData } = require('../helper/PromiseModule');
// });

Router.use('', isLogged,  indexRouter);

Router.use('/api', isLogged, apiRouter);
Router.use(EDITORIAL, isLogged, editorialRouter);
Router.use('/articles', isLogged, articlesRouter);
Router.use('/guide', isLogged, guideRouter);
Router.use('/submit', isLogged, submitRouter);
Router.use('/indexing', isLogged, indexingRouter);
Router.use('/track', isLogged, trackRouter);
Router.use('/contact', isLogged, contactRouter);
Router.use('/login', isLogged, loginRouter);
Router.use('/register', isLogged, registrationRouter);
Router.use('/admin_panel', isLogged, isAdmin, adminPanelRouter);
Router.use('/reviewer_panel', isLogged, reviewerRouter);
Router.use('/profile', profileRouter);
Router.use('/logout', logoutRouter);

module.exports = Router;