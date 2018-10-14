const db = require('../db');
const Calendary = require('./calendary');
const progressUser = require('./progressUser');

class User{
  constructor({id, name, mobile, weight, height, password, mail})
  {
    this.id =  id;
    this.name= name;
    this.mobile= mobile;
    this.weight = weight;
    this.height = height;
    this.password= password;
    this.mail = mail;
  }

  save(){
    db.new(this);//table,this
  }

   static async getUsers(){
     const data = await db.getAll('user');
     const response = [];
     data.forEach((row) => {
       response.push(new User(row));
     });
     return response;
   }

   static async getUser(idUser) {
    const data = await db.get('user', idUser); //Row del User
    if (data.length !== 0) {
      const user = new User(data[0]); //Row > Objeto User
      user.calendarys = await User.getCalendarys(user.id);
      return user;
    }
    return data;
  }
  //Busca en la db userCalendary donde este el usuario
  static async getCalendarys(idUser) {
    const data = await db.select('userCalendary', { idUser }); //Rows con id idUser idCalendary
    const response = [];
    //buscar las rutinas asociadas al usuario en la tabla rutinas
    const myPromises = data.map(async (row) => {
      const calendary = await Calendary.getCalendary(row.idCalendary, true);
      response.push(calendary);
    });
    await Promise.all(myPromises); //si se cumplen todas las promesas
    return response;
  }

  static async createUser({ name, mobile, weight, height, password, mail }) {

    let response;
    try {
      response = await db.insert('user', { name, mobile, weight, height, password, mail });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new User({ id, name, mobile, weight, height, password, mail });
    }
    return [];
  }

  async updateUser(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('user', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async deleteUser(idUser) {
    let deletedRows;
    try {
      const results = await db.delete('user', idUser);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async addCalendary(idUser, idCalendary) {
    let response;
    try {
      response = await db.insert('userCalendary', { idUser, idCalendary });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idUser , idCalendary };
    }
   return [];
  }

  static async removeCalendary(idUser, idCalendary) {
    let response;
    try {
      response = await db.adv_delete('userCalendary', { idUser, idCalendary });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idUser , idCalendary };
    }
    //return [];
  }

  static async getProgress(idUser) {
      let data = await db.select('progressUser', { idUser: idUser });
      const response = [];
      data.forEach((row) => {
        response.push(new progressUser(row));
      });
      return response;
  }

  static async addProgress(idUser, weight, height ) {
    let response;
    try {
      response = await db.insert('progressUser', { idUser, weight, height });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idUser , weight, height };
    }
   return [];
  }


}

module.exports = User;
