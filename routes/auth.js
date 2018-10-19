const router = require('express').Router();
const { authCtrl } = require('../controllers');
const { auth } = require('../middlewares');

router.post('/register', auth.noSession , (req, res) => {
  res.send('register');
});

router.post('/login', auth.noSession , (req, res) => {

});

router.get('/logout', auth.haveSession , (req, res) => {

});

module.exports = router;
