// manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const exercisesRouter = require('./exercises');
const bodyPartsRouter = require('./bodyParts');
const trainingTypesRouter = require('./trainingTypes');

router.get('/', (req, res) => res.send('hello'));

router.use('/users', usersRouter);

router.use('/exercises', exercisesRouter);

router.use('/bodyParts', bodyPartsRouter);

router.use('/trainingTypes', trainingTypesRouter);

module.exports = router;
