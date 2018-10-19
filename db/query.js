const mysql = require('mysql');

const First = 0;
const Zero = 0;
const One = 1;

class Query {
  constructor() {
    this.oplog = ['and', 'or'];
    this.oprel = ['=', '<>', '<', '<=', '>', '>=', 'in', 'like'];
    this.defaultCondition = '1';
    this.emptyQuery = '';
    this.allColumns = '*';
  }

  columns(cols) {
    if (!cols || !cols.length) {
      return this.allColumns;
    }
    return mysql.format('??', [cols]);
  }

  from(tables) {
    if (!tables || !tables.length) {
      return this.empty;
    }
    return mysql.format('??', [tables]);
  }

  where(qryCond = {}, op = this.oprel[First]) {
    const keys = Object.keys(qryCond);
    if (keys.length === Zero) {
      return this.defaultCondition;
    }

    if (keys.length > One) {
      const tmpQry = {};
      tmpQry[this.oplog[First]] = qryCond;
      return this.where(tmpQry, op);
    }
    const key = keys[First];
    const conds = [];
    if (this.oplog.includes(key.toLowerCase())) {
      Object.keys(qryCond[key]).forEach((cond) => {
        const tmpQry = {};
        tmpQry[cond] = qryCond[key][cond];
        conds.push(this.where(tmpQry, op));
      });
      return conds.length > Zero
        ? conds.join(` ${key.toUpperCase()} `)
        : this.defaultCondition;
    }
    if (this.oprel.includes(key.toLowerCase())) {
      return this.where(qryCond[key], key);
    }
    return mysql.format(`?? ${op.toUpperCase()} ?`, [key, qryCond[key]]);
  }

  orderBy(sorter, desc) {
    if (!sorter) {
      return this.emptyQuery;
    }
    return mysql.format(` ORDER BY ?? ${desc ? 'DESC' : 'ASC'}`, [sorter]);
  }

  limit(lim) {
    if (!lim) {
      return this.emptyQuery;
    }
    return mysql.format(' LIMIT ?', [lim]);
  }

  select({
    cols, from, where, sorter, desc, limit,
  }) {
    const qryColumns = this.columns(cols);
    const qryTables = this.from(from);
    const qryCond = this.where(where);
    const qryOrder = this.orderBy(sorter, desc);
    const qryLimit = this.limit(limit);
    return `SELECT ${qryColumns} FROM ${qryTables} WHERE ${qryCond}${qryOrder}${qryLimit}`;
  }

  insert({ into, resource }) {
    const qryTable = this.from(into);
    return mysql.format(`INSERT INTO ${qryTable} SET ?`, [resource]);
  }

  update({
    table, assign, where, sorter, desc, limit,
  }) {
    const qryTable = this.from(table);
    const qryCond = this.where(where);
    const qryOrder = this.orderBy(sorter, desc);
    const qryLimit = this.limit(limit);
    return mysql.format(`UPDATE ${qryTable} SET ? WHERE ${qryCond}${qryOrder}${qryLimit}`, [assign]);
  }

  delete({
    from, where, sorter, desc, limit,
  }) {
    const qryTable = this.from(from);
    const qryCond = this.where(where);
    const qryOrder = this.orderBy(sorter, desc);
    const qryLimit = this.limit(limit);
    return `DELETE FROM ${qryTable} WHERE ${qryCond}${qryOrder}${qryLimit}`;
  }
}

module.exports = new Query();
