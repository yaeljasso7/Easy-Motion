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

  formatColumns(cols) {
    if (!cols || !cols.length) {
      return this.allColumns;
    }
    return mysql.format('??', [cols]);
  }

  formatTables(tables) {
    if (!tables || !tables.length) {
      return this.empty;
    }
    return mysql.format('??', [tables]);
  }

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
    return mysql.format(`?? ${op.toUpperCase()} ?`, [key, qryCond[key]]);
  }

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

  formatOrderBy(sorter, desc) {
    if (!sorter) {
      return this.emptyQuery;
    }
    return mysql.format(` ORDER BY ?? ${desc ? 'DESC' : 'ASC'}`, [sorter]);
  }

  formatLimit(lim) {
    if (!lim) {
      return this.emptyQuery;
    }
    return mysql.format(' LIMIT ?', [lim]);
  }

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

  insert({ into, resource }) {
    const qryTable = this.formatTables(into);
    return mysql.format(`INSERT INTO ${qryTable} SET ?`, [resource]);
  }

  update({
    table, assign, where, sorter, desc, limit,
  }) {
    const qryTable = this.formatTables(table);
    const qryCond = this.formatCondition(where);
    const qryOrder = this.formatOrderBy(sorter, desc);
    const qryLimit = this.formatLimit(limit);
    return mysql.format(`UPDATE ${qryTable} SET ? WHERE ${qryCond}${qryOrder}${qryLimit}`, [assign]);
  }

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
