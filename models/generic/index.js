const db = require('../../db');

/**
 * @function exists - Checks object existence in database table
 *
 * @param  {string} table - The table where to check
 * @return {asyncFunction} - Async Function to check objects existence by id
 */
function exists(table) {
  const tbl = table;
  /**
   * [description]
   * @param  {number}  id - The object identifier
   * @return {Promise}    - Represents the query results
   */
  return async (id) => {
    try {
      const data = await db.select({
        columns: 'id',
        from: tbl,
        where: {
          id,
          isDeleted: false,
        },
        limit: 1,
      });
      return (data.length !== 0);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = { exists };
