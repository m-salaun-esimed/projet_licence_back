const BaseDAO = require('./basedao')

module.exports = class CategorieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }
};