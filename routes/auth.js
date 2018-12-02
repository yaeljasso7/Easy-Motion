const router = require('express').Router();
const { auth, validator } = require('../middlewares');

router.post('/register', (req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      email: 'email,required',
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
      email: 'email,required',
    },
  });
}, auth.login);

router.get('/logout', [auth.haveSession, auth.logout], (req, res) => {
  res.send('Logged out!');
});

router.get('/logout', [auth.haveSession, auth.logout], (req, res) => {
  res.send('Logged out!');
});

router.post('/forgot', auth.forgot);

router.get('/reset', auth.confirm);
router.post('/reset', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      password: 'required',
      rePassword: 'required',
    },
  });
}, validator.matchPassword], auth.reset);

router.get('/confirm', auth.confirm);
router.post('/confirm', auth.haveSession, (req, res) => {
  auth.sendMsg(req.session.user, auth.confirmMsg);
  res.send('Check your email');
});

router.get('/haveSession', auth.haveSession, (req, res) => {
  res.send(JSON.stringify({ a: 1 }));
});


module.exports = router;
