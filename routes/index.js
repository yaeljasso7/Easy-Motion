//manipulador de rutas
const router = require('express').Router();
const usersRouter = require('./users');
/*
const bodyParser = require('body-parser'); //req.body
//body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
*/
router.get('/', (req,res) => res.send('hello'));

router.use('/users', usersRouter);
/*
AGREGAR NUEVAS RUTAS
*/

module.exports = router;
