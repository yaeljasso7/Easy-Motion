const mdl = require('../models');

/**
 * @class Reference
 * Checks if the identifiers referred by an object (created, or modified),
 * belong to existing objects in the database.
 * ----------
 * Usage:
 *   Reference.validate(req, res, next, {
 *     body: {                            <-  section
 *       bodyPartId: 'BodyPart',          <- fieldName1 : 'Type1'
 *       trainingTypeId: 'TrainingType',  <- fieldName2 : 'Type2'
 *     }
 *   });
 */
class Reference {
  static async validate(req, res, next, sections) {
    const error = {
      message: 'Reference Error',
      status: 409,
      details: {},
    };
    const bySection = Object.keys(sections).map(async (part) => {
      try {
        const byPart = Object.keys(sections[part]).map(async (field) => {
          const type = sections[part][field];
          const id = req[part][field];
          if (id) {
            const exists = await mdl[type].exists(id);
            if (!exists) {
              if (!error.details[part]) {
                error.details[part] = [];
              }
              error.details[part].push(`${field}: ${id}, doesn't exist!`);
            }
          }
        });
        await Promise.all(byPart);
      } catch (err) {
        if (!error.details.unexpected) {
          error.details.unexpected = [];
        }
        error.details.unexpected.push(err);
      }
    });
    await Promise.all(bySection);
    if (Object.keys(error.details).length) {
      next(error);
    } else {
      next();
    }
  }
}

module.exports = Reference;
