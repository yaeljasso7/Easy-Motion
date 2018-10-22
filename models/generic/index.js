const db = require('../../db');

/**
 * @function exists - Checks object existence in database table
 *
 * @param  {string} table - The table where to check
 * @return {asyncFunction} - Async Function to check object existence by id
 */
function exists(table) {
  const tbl = table;
  /**
   * Checks object existence by id
   * @param  {number}  id - The object identifier
   * @return {Promise} [boolean] - Promise Object represents if the object exists
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
