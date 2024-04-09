const BaseDAO = require('./basedao')

module.exports = class CategoryParSerieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }
};