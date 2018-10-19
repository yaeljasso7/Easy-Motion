const db = require('../db');

class progressUser{
  constructor({idUser, weight, height, date})
  {
    this.idUser =  idUser;
    this.weight = weight;
    this.height = height;
    this.date = date;
  }

}

module.exports = progressUser;
