//manipulador de rutas
const express = require('express'); //llamar express
const router = express.Router(); //usando solo un modulo de express
const bodyParser = require('body-parser'); //req.body
const usersRouter = require('./users'); //cargamos modulo users


//body-parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req,res) => res.send('hello'));

router.use('/users', usersRouter);
/*
AGREGAR NUEVAS RUTAS
*/

module.exports = router;
