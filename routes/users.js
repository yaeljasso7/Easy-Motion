const express = require('express'); //llamar express
const router = express.Router(); //usando solo un modulo de express
const { usersCtrl } = require('../controllers');
//const {usersCtrl} = require('../controllers');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', usersCtrl.getAll);

//regresa solo un usuario
router.get('/:id', usersCtrl.getUser);

//crear //se necesita instalar body-parser
router.post('/', usersCtrl.createUser);

//modificar
router.put('/:id', usersCtrl.updateUser);

//eliminar
router.delete('/:id', usersCtrl.deleteUser);

module.exports = router;
