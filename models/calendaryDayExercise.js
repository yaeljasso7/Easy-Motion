const db = require('../db');

class calendaryDayExercise{
  constructor({id, idCalendary, Day, idExercise})
  {
    this.id =  id;
    this.idCalendary = idCalendary;
    this.Day = Day;
    this.idExercise = idExercise;
  }

  save(){
    db.new(this);//table,this
  }

   static async getcalendaryDayExercises(){
     const data = await db.getAll('calendaryDayExercise');
     const response = [];
     data.forEach((row) => {
       response.push(new calendaryDayExercise(row));
     });
     console.log(response);
     return response;
   }

   static async getcalendaryDayExercise(idcalendaryDayExercise) {
    const data = await db.get('calendaryDayExercise', idcalendaryDayExercise);
    return data.length !== 0 ? new calendaryDayExercise(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async deletecalendaryDayExercise(idcalendaryDayExercise) {
    let deletedRows;
    try {
      const results = await db.delete('calendaryDayExercise', idcalendaryDayExercise);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async createcalendaryDayExercise({ idCalendary, Day, idExercise }) {

    let response;
    try {
      response = await db.insert('calendaryDayExercise', { idCalendary, Day, idExercise });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new calendaryDayExercise({ id, idCalendary, Day, idExercise});
    }
    return [];
  }

  async updatecalendaryDayExercise(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('calendaryDayExercise', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = calendaryDayExercise;
