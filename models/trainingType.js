const db = require('../db');
const generic = require('./generic');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos
// deberian manejar los errores a traves de un try-catch

class TrainingType {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getAll(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: TrainingType.table,
        where: { isDeleted: false },
        limit: [page * pageSize, pageSize],
      });
      data.forEach((row) => {
        response.push(new TrainingType(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async get(id) {
    let data;
    try {
      data = await db.select({
        from: TrainingType.table,
        where: {
          id,
          isDeleted: false,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir
    // tu propio objeto en el manejador de la base de datos
    return data.length !== 0 ? new TrainingType(data[0]) : [];
  }

  static async create({ name, description }) {
    let response;
    try {
      response = await db.insert({
        into: TrainingType.table,
        resource: {
          name,
          description,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new TrainingType({ id, name, description });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: TrainingType.table,
        assign: keyVals,
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }

  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: TrainingType.table,
        assign: {
          isDeleted: true,
        },
        where: {
          id: this.id,
          isDeleted: false,
        },
        limit: 1,
      });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return deletedRows > 0;
  }
}

TrainingType.table = 'training_types';
TrainingType.exists = generic.exists(TrainingType.table);

module.exports = TrainingType;
