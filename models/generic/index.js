const db = require('../../db');

/**
 * @function exists - Checks object existence in database table
 *
 * @param  {string} table - The table where to check
 * @return {asyncFunction} - Async Function to check the object existence
 */
function exists(table, columns = 'id') {
  const tbl = table;
  const col = columns.constructor === Array ? columns : [columns];
  /**
   * Checks object existence by the columns specified above
   * @param  {number}  val - The object values to be matched with the columns
   * @return {Promise} [Boolean] - Promise Object, represents whether the object exists
   */
  return async (val) => {
    const vals = val.constructor === Array ? val : [val];
    const cond = { deleted: false };
    vals.forEach((v, i) => {
      cond[col[i]] = v;
    });
    try {
      const data = await db.select({
        columns: col,
        from: tbl,
        where: cond,
        limit: 1,
      });
      return (data.length !== 0);
    } catch (err) {
      throw err;
    }
  };
}

function removeEmptyValues(obj) {
  const cleanObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      cleanObj[key] = obj[key];
    }
  });
  return cleanObj;
}

module.exports = { exists, removeEmptyValues };
