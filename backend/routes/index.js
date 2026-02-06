const express = require('express');
const router = express.Router();
router.use('/utilisateurs', require('./utilisateurs'));
router.use('/salles', require('./salles'));
module.exports = router;