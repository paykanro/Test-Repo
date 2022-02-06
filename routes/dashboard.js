const Express = require('express');
const router = Express.Router();
const UserRouter = require('./dashboard/user');
const URLLinkRouter = require('./dashboard/urlLink');
const CategoryRouter = require('./dashboard/category'); 

//Router.use('/user', UserRouter);
router.use('/link', URLLinkRouter);
router.use('/category', CategoryRouter);

module.exports = router;