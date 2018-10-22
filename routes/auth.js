const router = require('express').Router();
const { auth, validator } = require('../middlewares');

router.post('/register', (req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      mail: 'email,required',
      mobile: 'iscellphone',
      height: 'isHeight,required',
      weight: 'isWeight,required',
    },
  });
}, auth.register);

router.post('/login', (req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      password: 'required',
      mail: 'email,required',
    },
  });
}, auth.login);

router.get('/logout', [auth.haveSession, auth.logout], (req, res) => {
  res.send('Logged out!');
});

module.exports = router;
