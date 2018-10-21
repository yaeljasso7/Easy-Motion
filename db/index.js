const mysql = require('mysql');
const Qry = require('./query');

// FIXME Falta documentacion en todos los metodos

class DB {
  constructor() {
    this.conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    this.conn.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Db Conect!');
      }
    });
  }

  /**
   * @method select - Retrieve rows selected from one or more tables.
   *
   * @param  {(string|string[])} columns - The column or columns that you want
   *         to retrieve.
   *         ----------
   *         Usage:
   *           columns: [ 'col_name1', ... , 'col_nameN' ]
   *           columns: 'col_name'
   *
   *         If no columns specified, all columns are retrieved.
   *
   * @param  {(string|string[])} from - The table or tables from which to
   *         retrieve rows.
   *         ----------
   *         Usage:
   *           from: [ 'tbl_name1', ... , 'tbl_nameN' ]
   *           from: 'tbl_name'
   *
   * @param  {Object} where - The condition or conditions that rows must to
   *         satisfy to be selected.
   *         ----------
   *         Usage:
   *           where: {
   *             <conditional>
   *             ...
   *             <conditional>
   *           }
   *
   *           <conditional>
   *           logic: { <- [Optional] Logic Operator
   *             <expression>
   *             ...
   *             <expression>
   *             }
   *           }
   *
   *          <expression>
   *          operator: { <- [Optional] Comparison Operator
   *            col_name: value
   *          }
   *
   *         Available logic operators
   *           and, or
   *         Available comparison operators
   *           =, <>, <, <=, >, >=, like, in
   *
   *         If no logical operator specified, uses AND by default
   *         If no comparison operator specified, uses = by default
   *
   *         If no condition specified, all records are selected.
   *
   * @param  {(string|string[])} sorter - Sort the records in a result set.
   *         ----------
   *         Usage:
   *           sorter: ['key_part1', 'key_part2']
   *           sorter: 'key_part'
   *
   *         If no sorter specified, the results aren't sorted.
   *
   * @param  {boolean} desc - Sorts the result set in descending order.
   *         ----------
   *         Usage:
   *           desc: true
   *           desc: false  <-  Optional
   *
   * @param  {(number|number[])} limit - Limit the number of records returned.
   *         ----------
   *         Usage:
   *           limit: [start_from, row_count]
   *           limit: row_count
   *
   * @return {Promise} - Promise object represents the query results.
   */
  select({
    columns, from, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({
        columns, from, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method advDelete - Remove rows from a table
   *
   * @param  {(string|string[])} from - The table or tables from which to
   *         delete rows.
   * @param  {Object} where - Identify which rows to delete, with no WHERE,
   *         all rows are deleted.
   * @param  {(string|string[])} sorter - Delete rows in the specified order.
   * @param  {boolean} desc - Delete the rows in descending order.
   * @param  {(number|number[])} limit - Limit the number of rows deleted.
   * @return {Promise} - Promise object represents the query results.
   */
  advDelete({
    from, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.delete({
        from, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method advUpdate - Modifies rows in a table
   *
   * @param  {(string|string[])} table - The table or tables from which to
   *         modify rows.
   * @param  {Object} assign - Indicates which columns to modify and the values
   *         they should be given.
   * @param  {Object} where - Identify which rows to modify, with no WHERE,
   *         all rows are modified.
   * @param  {(string|string[])} sorter - Modify rows in the specified order.
   * @param  {boolean} desc - Modify rows in descending order.
   * @param  {(number|number[])} limit - Limit the number of rows modified.
   * @return {Promise} - Promise object represents the query results.
   */
  advUpdate({
    table, assign, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.update({
        table, assign, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method getAll - Retrieve all elements from a table.
   *
   * @param  {string} table The table from which to retrieve the records.
   * @return {Promise} - Promise object represents the query results.
   */
  getAll(table) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({ from: table }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method get - Retrieve elements from a table, based on their id.
   *
   * @param  {string} table The table from which to retrieve records.
   * @param  {number} id - Object id to select.
   * @return {Promise} - Promise object represents the query results.
   */
  get(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({ from: table, id }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method delete - Delete elements from a table, based on their id.
   *
   * @param  {string} table The table from which to delete rows.
   * @param  {number} id - Object id to delete.
   * @return {Promise} - Promise object represents the query results.
   */
  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.delete({
        from: table,
        where: { id },
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method update - Modifies elements in a table, based on their id.
   *
   * @param  {string} table The table from which to modify rows.
   * @param  {Object} obj - Indicates which columns to modify and the values
   *         they should be given.
   * @param  {number} id - Object id to modify.
   * @return {Promise} - Promise object represents the query results.
   */
  update(table, obj, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.update({
        table,
        assign: obj,
        where: { id },
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method insert - Inserts new rows into an existing table.
   *
   * @param  {string} into - Table to which insert the Object.
   * @param  {Object} resource - The object to insert into the table.
   * @return {Promise} - Promise object represents the query results.
   */
  insert({ into, resource }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.insert({ into, resource }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  /**
   * @method processError - Process the error message from database,
   * into a readable error message.
   *
   * @param  {Object} err - The database error message
   * @return {Object} - The error message processed
   */
  processError(err) {
    const error = {};
    let data;
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        data = this.getDataFromErrorMsg(err.sqlMessage);
        error.duplicated = {
          message: `${data.field} with value ${data.data} already exists!`,
          field: data.field,
          sql: err.sql,
        };
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        data = this.getDataFromErrorMsg(err.sqlMessage);
        error.noReference = {
          message: `${data.field} with value ${data.data} doesn't exist!`,
          sql: err.sql,
        };
        break;
      default:
        error[err.code] = {
          message: err.sqlMessage,
          sql: err.sql,
        };
    }
    return error;
  }

  /**
   * @method getDataFromErrorMsg - Convert string error message into an object.
   *
   * @param  {string} message - The message error from database.
   * @return {Object} - The error message as an object.
   */
  getDataFromErrorMsg(message) {
    this.void();
    const data = unescape(message).match(/'([^']+)'/g);
    return {
      field: data[1].slice(1, -1),
      data: data[0].slice(1, -1),
    };
  }
}

module.exports = new DB();
