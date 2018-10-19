const router = require('express').Router();
const { usersCtrl } = require('../controllers');
const middlewares = require('../middlewares');

/* rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos */
router.get('/', usersCtrl.getAll);
router.get('/:idUser', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
    });
}, usersCtrl.get);

router.post('/', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        body: {
            name: 'word,required',
            mail: 'email,required',
            mobile: 'iscellphone',
            height: 'isHeight,required',
            weight: 'isWeight,required',
        },
    });
}, usersCtrl.create);

router.put('/:idUser', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
        body: {
            mobile: 'iscellphone',
            height: 'isHeight',
            weight: 'isWeight',
        },
    });
}, usersCtrl.update);

router.delete('/:idUser', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
    });
}, usersCtrl.delete);

router.post('/:idUser/calendars', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
        body: {
            idCalendar: 'number',
        },
    });
}, usersCtrl.addCalendar);

router.delete('/:idUser/calendars', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
        body: {
            idCalendar: 'number',
        },
    });
}, usersCtrl.removeCalendar);

router.get('/:idUser/progress', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
    });
}, usersCtrl.getProgress);

router.post('/:idUser/progress', (req, res, next) => {
    middlewares.validator.validate(req, res, next, {
        params: {
            idUser: 'number',
        },
        body: {
            weight: 'number,isWeight',
            height: 'number,isHeight',
        },
    });
}, usersCtrl.addProgress);

module.exports = router;
