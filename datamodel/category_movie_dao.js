const BaseDAO = require('./basedao')

module.exports = class CategoryDao extends BaseDAO {
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
            const result = await this.db.query(`SELECT id FROM ${this.tablename} WHERE idapi = $1`, [idApi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getIdCategory(idMovie){
        let tab = "moviecategory"
        try {
            const result = await this.db.query(`SELECT id FROM ${tab} WHERE idmovie = $1`, [idMovie]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

};