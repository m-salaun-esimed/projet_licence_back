const BaseDAO = require('./basedao')

module.exports = class FavoriteDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
        this.tablename = "favoritemovie"
    }

    async getAllFavoriteByIdUser(idUser){
        console.log("idUser " + idUser)
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablename} WHERE iduser = ${idUser}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async insertFavorite(data){
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${this.tablename} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;

        return this.db.query(query, values)
    }

    async deleteFavoriteByMovieIdApiUser(idMovieApi, user) {
        try {
            const query = `
            DELETE FROM ${this.tablename}
            WHERE idmovieapi = $1 AND iduser = $2
        `;
            const values = [idMovieApi, user.id];

            await this.db.query(query, values);

            console.log('L\'événement a été supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            throw error;
        }
    }

    async getMoviesBySearch(query, user){
        try {
            const queryString = `
            SELECT movie.*
            FROM movie
            JOIN favoritemovie fm ON movie.idapi = fm.idmovieapi
            WHERE fm.iduser = $1 AND movie.name LIKE '%${query}%'
        `;
            const values = [user.id];

            const result = await this.db.query(queryString, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }



};