const BaseDAO = require('./basedao')

module.exports = class MoviePlatformDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }
};