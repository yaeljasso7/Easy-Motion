const db = require('../db');

class User{
  constructor({id, name, mobile, weight, height, password, mail})
  {
    this.idUser =  id;
    this.nameUser = name;
    this.mobileUser = mobile;
    this.weightUser = weight;
    this.heightUser = height;
    this.passwordUser = password;
    this.mailUser = mail;
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
     console.log(response);
     return response;
   }

   static async getUser(idUser) {
    const data = await db.get('user', idUser);
    return data.length !== 0 ? new User(data[0]) : data; //elemento 0 de rowDataPackege
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
      const results = await db.update('user', keyVals, this.idUser);
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


}

module.exports = User;
