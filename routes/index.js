// manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const exercisesRouter = require('./exercises');

router.get('/', (req, res) => res.send('hello'));

router.use('/users', usersRouter);

router.use('/exercises', exercisesRouter);

module.exports = router;
