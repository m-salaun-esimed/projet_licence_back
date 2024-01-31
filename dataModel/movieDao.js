const BaseDAO = require('./basedao')

module.exports = class MovieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }
};