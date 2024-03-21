const BaseDAO = require('./basedao')

module.exports = class CategorieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllMovieCategory(){
        try {
            const result = await this.db.query(`SELECT name FROM ${this.tablename}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};