const db = require('../db');

// FIXME Falta documentacion en todos los metodos

class BodyPart {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: 'body_parts',
        where: { isDeleted: false },
        limit: [page * pageSize, pageSize],
      });

      data.forEach((row) => {
        response.push(new BodyPart(row));
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
        from: 'body_parts',
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
    return data.length !== 0 ? new BodyPart(data[0]) : [];
  }

  static async create({ name }) {
    let response;
    try {
      response = await db.insert({
        into: 'body_parts',
        resource: {
          name,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new BodyPart({ id, name });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: 'body_parts',
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

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: 'body_parts',
        assign: {
          isDeleted: true,
        },
        where: {
          id,
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

module.exports = BodyPart;
