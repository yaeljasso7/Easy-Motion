const db = require('../db');

class exerciseOnRoutine{
  constructor({id, idRoutine, idExercise})
  {
    this.idexerciseOnRoutine =  id;
    this.idRoutineexerciseOnRoutine = idRoutine;
    this.idExerciseexerciseOnRoutine = idExercise;

  }

  save(){
    db.new(this);//table,this
  }

   static async getexerciseOnRoutines(){
     const data = await db.getAll('exerciseOnRoutine');
     const response = [];
     data.forEach((row) => {
       response.push(new exerciseOnRoutine(row));
     });
     console.log(response);
     return response;
   }

   static async getexerciseOnRoutine(idexerciseOnRoutine) {
    const data = await db.get('exerciseOnRoutine', idexerciseOnRoutine);
    return data.length !== 0 ? new exerciseOnRoutine(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async createexerciseOnRoutine({ idRoutine, idExercise }) {
    let response;
    try {
      response = await db.insert('exerciseOnRoutine', { idRoutine, idExercise });
    //  console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new exerciseOnRoutine({ id, idRoutine, idExercise });
    }
    return [];
  }

  async updateexerciseOnRoutine(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('exerciseOnRoutine', keyVals, this.idexerciseOnRoutine);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async deleteexerciseOnRoutine(idexerciseOnRoutine) {
    let deletedRows;
    try {
      const results = await db.delete('exerciseOnRoutine', idexerciseOnRoutine);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

}

module.exports = exerciseOnRoutine;
