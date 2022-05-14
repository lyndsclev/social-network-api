const router = require('express').Router();

// import all api routes 
const apiRoutes = require('./api'); 

// add /api prefix 
router.use('/api', apiRoutes); 

module.exports = router;

