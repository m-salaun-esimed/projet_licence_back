const BaseDAO = require('./basedao')

module.exports = class StreamingDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllstreamingPlatform() {
        try {
            const result = await this.db.query(`SELECT name FROM ${this.tablename}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};