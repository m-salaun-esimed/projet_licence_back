const BaseDAO = require('./basedao')

module.exports = class MovieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllMovieAlreadySeen(){
        let tab = "moviealreadyseen"
        try {
            return  await this.db.query(`SELECT * FROM ${tab}`);
        } catch (error) {
            throw error;
        }
    }

    async getAllMovie(){
        let tab = "movie"
        try {
            const result = await this.db.query(`SELECT * FROM ${tab}`);
        } catch (error) {
            throw error;
        }
    }

    async getMovieByIdMovieApi(idmovieapi){
        let tab = "movie"
        try {
            const result = await this.db.query(`SELECT * FROM ${tab} WHERE idapi=${idmovieapi}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    async getMoviesByCategories(categoryIds) {
        try {
            let tab = "movieCategory";
            const queryString = `SELECT * FROM ${tab} WHERE idcategory IN (${categoryIds.join(',')})`;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getMoviesByIds(idMovies) {
        try {
            const tab = "movie";
            const queryString = `SELECT * FROM ${tab} WHERE id IN (${idMovies.join(',')})`;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getAllDejaVu(userId){
        try {
            const tab = "moviealreadyseen";
            const queryString = `SELECT * FROM ${tab} WHERE iduser = ${userId}`;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};