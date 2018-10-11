const router = require('express').Router();
const middlewares = require('../middlewares');

router.post('/register', middlewares.auth.register);

module.exports = router;
