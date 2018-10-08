//manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const blogRouter = require('./blog');
const categoryBlogRouter = require('./categoryBlog');
const calendaryRouter = require('./calendary');
const calendaryDayExerciseRouter = require('./calendaryDayExercise');
/*
const bodyParser = require('body-parser'); //req.body
//body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
*/
router.get('/', (req,res) => res.send('hello'));

router.use('/users', usersRouter);
router.use('/blog', blogRouter);
router.use('/categoryBlog',categoryBlogRouter);
router.use('/calendary',calendaryRouter);
router.use('/calendaryDayExercise',calendaryDayExerciseRouter);
/*
AGREGAR NUEVAS RUTAS
*/

module.exports = router;
