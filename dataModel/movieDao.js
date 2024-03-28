const BaseDAO = require('./basedao')

module.exports = class MovieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
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
    async getAllFavoriteByIdUser(idUser){
        let tab = "favoritemovie"
        console.log("idUser " + idUser)
        try {
            const result = await this.db.query(`SELECT * FROM ${tab} WHERE iduser = ${idUser}`);
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

    async insertFavorite(data){
        let tablename = `favoritemovie`
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${tablename} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;

        return this.db.query(query, values)
    }
};