const db = require('../db');

class Exercise {
  constructor({id, difficulty, executionTime, trainingType, bodyPart}) {
    this.id = id;
    this.difficulty = difficulty;
    this.executionTime = executionTime;
    this.trainingType = trainingType;
    this.bodyPart = bodyPart;
  }

  static async getExercises() {
    const data = await db.selectAll('exercises');
    const response = [];
    data.forEach( (row) => {
      response.push(new Exercise(row));
    } );
    return response;
  }

  static async getExercise(exerciseId) {
    const data = await db.select('exercises', exerciseId);
    return data.length !== 0 ? new Exercise(...data) : null;
  }

  static createExercise({difficulty, executionTime, trainingType, bodyPart}) {

  }

  static updateExercise(exerciseId, fields) {

  }

  static deleteExercise(exerciseId) {

  }

}

module.exports = Exercise;
