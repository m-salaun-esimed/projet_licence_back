const BaseDAO = require('./basedao')

module.exports = class CategorieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllMovieCategory(){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablename}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async findByApiIdDao(idApi){
        try {
            const result = await this.db.query(`SELECT id FROM ${this.tablename} WHERE idapi = ${idApi}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

};