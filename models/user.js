const db = require('../db');
const Routine = require('./routine');

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
      user.routes = await User.getRoutines(user.id);
      return user;
    }
    return data;
  }
  //Busca en la db user_routines donde este el usuario
  static async getRoutines(idUser) {
    const data = await db.select('userRoutine', { idUser }); //Rows con id idUser idRoutine
    const response = [];
    //buscar las rutinas asociadas al usuario en la tabla rutinas
    const myPromises = data.map(async (row) => {
      const routine = await Routine.get(row.idRoutine, true);
      response.push(routine);
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

  static async addRoutine(idUser, idRoutine) {
    let response;
    try {
      response = await db.insert('userRoutine', { idUser, idRoutine });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idUser , idRoutine };
    }
   return [];
  }

  static async removeRoutine(idUser, idRoutine) {
    let response;
    try {
      response = await db.adv_delete('userRoutine', { idUser, idRoutine });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idUser , idRoutine };
    }
    //return [];
  }


}

module.exports = User;
