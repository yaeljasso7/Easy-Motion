const db = require('../db');
const generic = require('./generic');

/**
 * @class TrainingType
 * Represents the training type that an exercise focuses on
 */
class TrainingType {
  /**
   * TrainingType constructor
   * @param {Number} id          The training type id
   * @param {String} name        The training type name
   * @param {String} description The training type description
   */
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  /**
   * @method getAll - Retrieve all the training types from a page
   *
   * @param  {Number}  [page=0] - The page to retrieve the training types
   * @return {Promise} - Promise Object represents, the training types
   * from that page.
   */
  static async getAll({
    page, sorter, desc, filters,
  }) {
    const pageSize = Number(process.env.PAGE_SIZE);
    const response = [];
    try {
      const data = await db.select({
        from: TrainingType.table,
        where: { ...filters, isDeleted: false },
        sorter,
        desc,
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

  /**
   * @method get - Retrieve a training type, based on its id
   *
   * @param  {Number}  id - The training type identifier
   * @return {Promise} - Promise Object represents a training type
   */
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

  /**
   * @method create - Inserts a training type into the database
   * @param  {String}  name - The training type name
   * @param  {String}  description - The training type description
   * @return {Promise} - Promise Object represents the training type created
   */
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

  /**
   * @method update - Modifies fields from this training type.
   *
   * @param  {Object}  keyVals - Represents the new values for this training type.
   * @return {Promise} - Promise Object represents the the operation success (boolean)
   */
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

  /**
   * @method delete - Deletes this training type.
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

/**
 * Database table which training types are located.
 * @type {String}
 */
TrainingType.table = 'training_types';
/**
 * Checks if a training type exists in the database, based on its id
 * @type {asyncFunction}
 */
TrainingType.exists = generic.exists(TrainingType.table);

TrainingType.ValidFilters = {
  name: 'asString',
};

module.exports = TrainingType;
