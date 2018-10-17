//manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const blogRouter = require('./blog');
const categoryBlogRouter = require('./categoryBlog');
const calendaryRouter = require('./calendary');
const calendaryDayExerciseRouter = require('./calendaryDayExercise');
const exercisesRouter = require('./exercises');
const bodyPartsRouter = require('./bodyParts');
const trainingTypesRouter = require('./trainingTypes');
const routinesRouter = require('./routines');

/*
const bodyParser = require('body-parser'); //req.body
//body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
*/
router.get('/', (req, res) => res.send('hello'));
router.use('/users', usersRouter);
router.use('/blog', blogRouter);
router.use('/categoryBlog', categoryBlogRouter);
router.use('/calendary', calendaryRouter);
router.use('/calendaryDayExercise', calendaryDayExerciseRouter);

router.use('/exercises', exercisesRouter);
router.use('/bodyParts', bodyPartsRouter);
router.use('/trainingTypes', trainingTypesRouter);
router.use('/routines', routinesRouter);


module.exports = router;
