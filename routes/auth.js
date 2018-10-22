const router = require('express').Router();
const { authCtrl } = require('../controllers');
const { auth } = require('../middlewares');
const middlewares = require('../middlewares');

router.post('/register', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      mail: 'email,required',
      mobile: 'iscellphone',
      height: 'isHeight,required',
      weight: 'isWeight,required',
    },
  });
}, authCtrl.registerUser);

router.post('/login', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      password: 'required',
      mail: 'email,required',
    },
  });
}, authCtrl.addToken);

router.get('/logout', auth.haveSession, (req, res) => {
  res.send('iLogin');
});

module.exports = router;
