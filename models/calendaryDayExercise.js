const db = require('../db');

class calendaryDayExercise{
  constructor({id, idCalendary, idDay, idExercise})
  {
    this.idcalendaryDayExercise =  id;
    this.idCalendarycalendaryDayExercise = idCalendary;
    this.idDaycalendaryDayExercise = idDay;
    this.idExercisecalendaryDayExercise = idExercise;
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

  static async createcalendaryDayExercise({ idCalendary, idDay, idExercise }) {

    let response;
    try {
      response = await db.insert('calendaryDayExercise', { idCalendary, idDay, idExercise });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new calendaryDayExercise({ id, idCalendary, idDay, idExercise});
    }
    return [];
  }

  async updatecalendaryDayExercise(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('calendaryDayExercise', keyVals, this.idcalendaryDayExercise);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = calendaryDayExercise;
