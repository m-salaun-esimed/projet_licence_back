const BaseDAO = require('./basedao')

module.exports = class AlreadySeenMovieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
        this.tablename = "alreadyseen"
    }

    async getAlreadySeenMovie(user) {
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablename} WHERE iduser = $1`, [user.id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getAlreadySeenMovieId(iduser) {
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablename} WHERE iduser = $1`, [iduser]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async insertAlreadySeenMovie(data){
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${this.tablename} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;

        return this.db.query(query, values)
    }

    async deleteAlreadySeenMovie(idapi, user, typecontenu){
        try {
            const query = `
            DELETE FROM ${this.tablename}
            WHERE idapi = $1 AND iduser = $2 AND typecontenu = $3
        `;
            const values = [idapi, user.id, typecontenu];

            await this.db.query(query, values);

            console.log('L\'événement a été supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            throw error;
        }
    }
};