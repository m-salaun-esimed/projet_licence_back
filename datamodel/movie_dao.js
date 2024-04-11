const BaseDAO = require('./basedao')
const fetch = require('node-fetch');

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
            const result = await this.db.query(`SELECT * FROM ${tab} WHERE idapi=$1`, [idmovieapi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    async getMoviesByCategorys(categoryIds) {
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
            const tab = "alreadyseen";
            const typecontenu = "film";

            const result = await this.db.query(`SELECT * FROM ${tab} WHERE iduser = $1 AND typecontenu = $2`, [userId, typecontenu]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getPlatform(idmovieapi) {
        try {
            const url = `https://api.themoviedb.org/3/movie/${idmovieapi}/watch/providers`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
                }
            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (data.results.FR){
                return data.results.FR
            }else {
                throw new Error('Les informations pour la France ne sont pas disponibles.');
            }
        } catch (error) {
            throw error;
        }
    }


    async getMoviesSerieBySearch(query){
        try {
            const queryString = `
        SELECT *
        FROM (
            SELECT *, 'movie' AS type
            FROM movie
            WHERE name LIKE '%${query}%'
            UNION
            SELECT *, 'serie' AS type
            FROM serie
            WHERE name LIKE '%${query}%'
        ) AS search_result
        `;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

};