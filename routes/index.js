// manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
const exercisesRouter = require('./exercises');
const bodyPartsRouter = require('./bodyParts');
const trainingTypesRouter = require('./trainingTypes');
const routinesRouter = require('./routines');

router.get('/', (req, res) => res.send('hello'));

router.use('/users', usersRouter);

router.use('/exercises', exercisesRouter);

router.use('/bodyParts', bodyPartsRouter);

router.use('/trainingTypes', trainingTypesRouter);

router.use('/routines', routinesRouter);

module.exports = router;
