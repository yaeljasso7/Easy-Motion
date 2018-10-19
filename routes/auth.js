const router = require('express').Router();
const middlewares = require('../middlewares');

router.post('/register', [middlewares.auth.register], (req, res) => {
  res.send('register');
});

router.post('/login', [middlewares.auth.login], (req, res) => {

});

router.get('/logout', [middlewares.auth.logout], (req, res) => {

});

module.exports = router;
