const router = require('express').Router();
const { authCtrl } = require('../controllers');
const { auth } = require('../middlewares');

router.post('/register' , (req, res) => {
  res.send('register');
});

router.post('/login', (req, res) => {

});

router.get('/logout', (req, res) => {

});

module.exports = router;
