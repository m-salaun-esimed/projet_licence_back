const BaseDAO = require('./basedao')

module.exports = class MovieCategoryDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }
};