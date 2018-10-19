const db = require('../db');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class calendarDayExercise{
  constructor({id, idCalendar, Day, idExercise})
  {
    this.id =  id;
    this.idCalendar = idCalendar;
    this.Day = Day;
    this.idExercise = idExercise;
  }

  save(){
    db.new(this);
  }

   static async getcalendarDayExercises(){
     const data = await db.getAll('calendarDayExercise');
     const response = [];
     data.forEach((row) => {
       response.push(new calendarDayExercise(row));
     });
     return response;
   }

   static async getcalendarDayExercise(idcalendarDayExercise) {
    const data = await db.get('calendarDayExercise', idcalendarDayExercise);
    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir tu propio objeto en el manejador de la base de datos
    return data.length !== 0 ? new calendarDayExercise(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async deletecalendarDayExercise(idcalendarDayExercise) {
    let deletedRows;
    try {
      const results = await db.delete('calendarDayExercise', idcalendarDayExercise);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async createcalendarDayExercise({ idCalendar, Day, idExercise }) {

    let response;
    try {
      response = await db.insert('calendarDayExercise', { idCalendar, Day, idExercise });
    } catch (e) {
      throw e;
    }
    const id = response.insertId;
    if (id > 0) {
      return new calendarDayExercise({ id, idCalendar, Day, idExercise});
    }
    return [];
  }

  async updatecalendarDayExercise(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('calendarDayExercise', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = calendarDayExercise;
