// manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const blogRouter = require('./blog');
const categoryBlogRouter = require('./categoryBlog');
const calendarRouter = require('./calendar');
const exercisesRouter = require('./exercises');
const bodyPartsRouter = require('./bodyParts');
const trainingTypesRouter = require('./trainingTypes');
const routinesRouter = require('./routines');
const authRouter = require('./auth');

const mailer = require('../mail');

router.get('/', (req, res) => {
  mailer.sendMail({ to: 'easymotion-user@mail.com' });
  res.send('hello');
});
router.use('/users', usersRouter);
router.use('/blog', blogRouter);
router.use('/categoryBlog', categoryBlogRouter);
router.use('/calendars', calendarRouter);
router.use('/exercises', exercisesRouter);
router.use('/bodyParts', bodyPartsRouter);
router.use('/trainingTypes', trainingTypesRouter);
router.use('/routines', routinesRouter);
router.use('/auth', authRouter);

module.exports = router;
