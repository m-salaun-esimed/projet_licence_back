const BaseDAO = require('./basedao')
const fetch = require('node-fetch');

module.exports = class MovieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllMovie(){
        let tab = "movie"
        try {
            const result = await this.db.query(`SELECT * FROM ${tab}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async addUrl(url, idapi) {
        const tab = "movie";
        try {
            const result = await this.db.query(
                `UPDATE ${tab} SET urltrailer = $1 WHERE idapi = $2`,
                [url, idapi]
            );
            return result.rows;
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


    async getMoviesSerieBySearch(query) {
        try {
            const queryString = `
        SELECT *
        FROM (
            SELECT *, 'movie' AS type
            FROM movie
            WHERE name ILIKE '%${query}%'
            UNION
            SELECT *, 'serie' AS type
            FROM serie
            WHERE name ILIKE '%${query}%'
        ) AS search_result
        `;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async deleteMovie(params) {
        const tab = "movie";
        let resultMovie;

        try {
            if (params.id) {
                const result = await this.db.query(`SELECT id FROM ${tab} WHERE idapi = $1`, [params.id]);
                if (result.rowCount === 0) {
                    throw new Error('Film non trouvée.');
                }
                const id = result.rows[0].id;
                await this.db.query(`DELETE FROM  moviecategory WHERE idmovie = $1`, [id]);
                resultMovie = await this.db.query(`DELETE FROM ${tab} WHERE idapi = $1 RETURNING *`, [params.id]);
            } else if (params.name) {
                console.log(params.name)
                const result = await this.db.query(`SELECT id FROM ${tab} WHERE name = $1`, [params.name]);
                if (result.rowCount === 0) {
                    throw new Error('Film non trouvée.');
                }
                const id = result.rows[0].id;
                await this.db.query(`DELETE FROM  moviecategory WHERE idmovie = $1`, [id]);

                resultMovie = await this.db.query(`DELETE FROM ${tab} WHERE name = $1 RETURNING *`, [params.name]);
            }

            return resultMovie;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateMovie(params, updateObject) {
        const tab = "movie";
        console.log(params)
        let resultMovie;
        try {
            if (params.id) {
                if (updateObject.name && !updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  name = $1 WHERE idapi = $2`, [updateObject.name, params.id]);
                }
                else if (!updateObject.name && updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  overview = $1 WHERE idapi = $2`, [updateObject.overview, params.id]);
                }
                else if (updateObject.name && updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  overview = $1, name = $2 WHERE idapi = $3
                    `, [updateObject.overview, updateObject.name, params.id]);
                }
            } else if (params.name) {
                if (updateObject.name && !updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  name = $1 WHERE name = $2`, [updateObject.name, params.name]);
                }
                else if (!updateObject.name && updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  overview = $1 WHERE name = $2`, [updateObject.overview, params.name]);
                }
                else if (updateObject.name && updateObject.overview){
                    resultMovie = await this.db.query(`UPDATE ${tab} SET  overview = $1, name = $2 WHERE name = $3
                    `, [updateObject.overview, updateObject.name, params.name]);
                }
            }

            return resultMovie;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};