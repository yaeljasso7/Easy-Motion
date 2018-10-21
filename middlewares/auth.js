const bcrypt = require('bcrypt');
const { Token, ResponseMaker } = require('../models');

class Auth {
  static isActive(createdAt, expires) {
    // date fecha del token + dias expires
    const date = new Date(createdAt);
    date.setDate(date.getDate() + expires);
    // fecha actual - now
    const now = new Date();
    if (date > now) {
    //  fecha valida
      return true;
    }
    // fecha caducada
    return false;
  }

  static async isLogin(req, res, next) {
    if (!req.headers.token) {
      next({
        status: 409,
        message: 'no hay sesión',
      });
      return;
    }
    const token = req.headers.token.split(' ')[1];
    // busca token en la db...
    try {
      const itoken = await Token.get(token);
      if (itoken.length === 0) {
        next({
          status: 204,
          message: 'no existe el token',
        });
        return;
      }
      // Si la fecha del token aun es valida
      if (Auth.isActive(itoken.createdAt, itoken.expires)) {
        console.log('todo bien');
        next();
      } else {
        // Desactivar el token en caso que siga activo
        if (itoken.active === 0) {
          itoken.active = 1;
          const updated = itoken.deactivate(itoken);
          if (updated) {
            next({
              status: 201,
              message: 'El token caduco',
            });
            return;
          }
        }
        // Si el usuario intento acceder con un token desactivado
        next({
          status: 409,
          message: 'El token caduco hace tiempo',
        });
        return;
      }
    } catch (e) {
      next({
        status: 403,
        message: 'error',
      });
      return;
    }
    // sigue activo ?
  }


  static login(req, res, next) {}
  static logout(req, res, next) {}
}
// userCtrl = register > inserta un user en la db , lo recupera y crea un token con el idUser+fechaactual
// userCtrl = login > busca si existe el usuario con la contraseña > busca en tokens si ese usuario tiene
//            una secion activa > si no > crea el token con el idUser+fechaactual y lo regreas idUser+token, lo copias
// middleware auth = saber si el token si existe el token > si esta activo

module.exports = Auth;
