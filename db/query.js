const mysql = require('mysql');

const First = 0;
const Zero = 0;
const One = 1;
const Like = 7;

/**
 * @class Query
 * Crates a formated string to be executed in the database.
 */
class Query {
  /**
   * Query Constructor
   * Defines some parameters: oplog, oprel, defaultCondition, emptyQuery
   */
  constructor() {
    this.oplog = ['and', 'or'];
    this.oprel = ['=', '<>', '<', '<=', '>', '>=', 'in', 'like'];
    this.defaultCondition = '1';
    this.emptyQuery = '';
    this.allColumns = '*';
  }

  /**
   * @method formatColumns - Format the columns name
   *
   * @param  {(String|String[])} cols - The column or columns to apply the format
   * @return {String} - The columns formated
   * ----------
   * Usage:
   *   formatColumns(['col1', 'col2']);
   *   formatColumns('col');
   * If not columns, return the universal [*]
   */
  formatColumns(cols) {
    if (!cols || !cols.length) {
      return this.allColumns;
    }
    return mysql.format('??', [cols]);
  }

  /**
   * @method formatTables - Format the tables
   *
   * @param  {(String|String[])} tables - The table or tables to apply the format
   * @return {String} - The tables formated
   */
  formatTables(tables) {
    if (!tables || !tables.length) {
      return this.empty;
    }
    return mysql.format('??', [tables]);
  }

  /**
   * @method formatCondition - Format a query condition
   *
   * @param  {Object} [qryCond={}]           - The query condition
   * ----------
   * Example:
   *   qryCond = {
   *     or: {
   *       id: 5,
   *       deleted: false
   *     }
   *     name: 'name'
   *   }
   * This example, will be interpreted as follows:
   *
   * id = 5 OR deleted = false AND name LIKE '%name%'
   *
   * @param  {String} [op=this.oprel[First]] - Default operator to join key-val
   * @return {String} - The query contition formated
   * If not qryCond passed. Returns '1'.
   */
  formatCondition(qryCond = {}, op = this.oprel[First]) {
    const keys = Object.keys(qryCond);
    if (keys.length === Zero) {
      return this.defaultCondition;
    }

    if (keys.length > One) {
      const tmpQry = {};
      tmpQry[this.oplog[First]] = qryCond;
      return this.formatCondition(tmpQry, op);
    }
    const key = keys[First];
    const conds = [];
    if (this.oplog.includes(key.toLowerCase())) {
      Object.keys(qryCond[key]).forEach((cond) => {
        const tmpQry = {};
        tmpQry[cond] = qryCond[key][cond];
        conds.push(this.formatCondition(tmpQry, op));
      });
      return conds.length > Zero
        ? conds.join(` ${key.toUpperCase()} `)
        : this.defaultCondition;
    }
    if (this.oprel.includes(key.toLowerCase())) {
      return this.formatCondition(qryCond[key], key);
    }
    if (op === this.oprel[First] && qryCond[key].constructor === String) {
      return mysql.format(`?? ${this.oprel[Like].toUpperCase()} ?`,
        [key, `%${qryCond[key]}%`]);
    }
    return mysql.format(`?? ${op.toUpperCase()} ?`, [key, qryCond[key]]);
  }

  /**
   * @method formatJoin - Formats the tables to be joined
   * @param  {(Object|Object[])} joins - Tables information for the joining
   * ----------
   * Usage:
   *   joins: {
   *     table: 'tbl1',
   *     on: { 'tbl.id1' = 'tbl1.id' }
   *   }
   *   joins: [{
   *     table: 'tbl1',
   *     on: { 'tbl.id1' = 'tbl1.id' }
   *     },{
   *     table: 'tbl2',
   *     on: { 'tbl.id2' = 'tbl2.id' }
   *     }]
   *
   * @return {String} - Formated tables, for the joining
   */
  formatJoin(joins) {
    if (!joins) {
      return this.emptyQuery;
    }
    const qryJoin = [];
    const tblJoin = (joins.constructor !== Array) ? [joins] : joins;
    tblJoin.forEach((join) => {
      const key = Object.keys(join.on)[First];
      const keyVal = join.on[key];
      qryJoin.push(mysql.format('JOIN ?? ON ?? = ??', [join.table, key, keyVal]));
    });

    return qryJoin.join(' ');
  }

  /**
   * @method formatOrderBy
   *
   * @param  {String} sorter - The attribute name to order the results
   * @param  {Boolean} desc  - On true, uses the descendent order;
   *         otherwise, it will use ascendent order
   * @return {String} - Formated OrderBy expression
   */
  formatOrderBy(sorter, desc) {
    if (!sorter) {
      return this.emptyQuery;
    }
    return mysql.format(` ORDER BY ?? ${desc ? 'DESC' : 'ASC'}`, [sorter]);
  }

  /**
   * @method formatLimit - Formats the limit of rows in the result
   *
   * @param  {(Number|Number[])} lim - The row limit
   * ----------
   * Usage:
   *   lim: row_count
   *   lim: [ start_from, row_count ]
   *
   * @return {String} - Formated Limit expression
   */
  formatLimit(lim) {
    if (!lim) {
      return this.emptyQuery;
    }
    return mysql.format(' LIMIT ?', [lim]);
  }

  /**
   * @method select - Returns a prefrab query, for the select operation
   *
   * @param  {(String|String[])} columns The columns names
   * @param  {(String|String[])} from - The tables from which select the rows
   * @param  {Object} where - The condition to select the rows
   * @param  {(Object|Object[])} join - The tables to join with
   * @param  {String} sorter - The sorter criteria
   * @param  {Boolean} desc - On true, order the results in descendent order
   * @param  {(Number|Number[])} limit - The limit of rows in the result
   * @return {String} - Formated select query
   */
  select({
    columns, from, where, join, sorter, desc, limit,
  }) {
    const qryColumns = this.formatColumns(columns);
    const qryTables = this.formatTables(from);
    const qryCond = this.formatCondition(where);
    const qryOrder = this.formatOrderBy(sorter, desc);
    const qryLimit = this.formatLimit(limit);
    const qryJoin = this.formatJoin(join);
    return `SELECT ${qryColumns} FROM ${qryTables} ${qryJoin} WHERE ${qryCond}${qryOrder}${qryLimit}`;
  }

  /**
   * @method insert - Returns a prefrab query, for the insert operation
   *
   * @param  {String} into     - The table name, which the object will be inserted
   * @param  {Object} resource - The object to insert into the database
   * @return {String}          - Formated insert query
   */
  insert({ into, resource }) {
    const qryTable = this.formatTables(into);
    return mysql.format(`INSERT INTO ${qryTable} SET ?`, [resource]);
  }

  /**
   * @method update - Returns a prefrab query, for the update operation
   *
   * @param  {String} table  - The table from which the elements will be updated
   * @param  {Object} assign - The key-values to be changed
   * @param  {Object} where  - The condition for a row to be updated
   * @param  {String} sorter - The order criteria, to apply the rows update
   * @param  {Boolean} desc  - On true, updates in descendent order
   * @param  {(Number|Number[])} limit - Limits the rows to update
   * @return {String} - Formated update query
   */
  update({
    table, assign, where, sorter, desc, limit,
  }) {
    const qryTable = this.formatTables(table);
    const qryCond = this.formatCondition(where);
    const qryOrder = this.formatOrderBy(sorter, desc);
    const qryLimit = this.formatLimit(limit);
    return mysql.format(`UPDATE ${qryTable} SET ? WHERE ${qryCond}${qryOrder}${qryLimit}`, [assign]);
  }

  /**
   * @method update - Returns a prefrab query, for the delete operation
   *
   * @param  {String} from  - The table from which the elements will be removed
   * @param  {Object} where  - The condition for a row to be deleted
   * @param  {String} sorter - The order criteria, to delete the row
   * @param  {Boolean} desc  - On true, deletes in descendent order
   * @param  {(Number|Number[])} limit - Limits the rows to delete
   * @return {String} - Formated delete query
   */
  delete({
    from, where, sorter, desc, limit,
  }) {
    const qryTable = this.formatTables(from);
    const qryCond = this.formatCondition(where);
    const qryOrder = this.formatOrderBy(sorter, desc);
    const qryLimit = this.formatLimit(limit);
    return `DELETE FROM ${qryTable} WHERE ${qryCond}${qryOrder}${qryLimit}`;
  }
}

module.exports = new Query();
