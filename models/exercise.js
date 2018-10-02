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

  static getExercise(exerciseId) {

  }

  static createExercise({difficulty, executionTime, trainingType, bodyPart}) {

  }

  static updateExercise(exerciseId, fields) {

  }

  static deleteExercise(exerciseId) {

  }

}

module.exports = Exercise;
