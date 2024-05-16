const BaseDAO = require('./basedao.js')
const fetch = require("node-fetch");

module.exports = class SerieDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getSeriesByCategories(categoryIdsArray){
        try {
            let tab = "categoryparserie";
            const queryString = `SELECT * FROM ${tab} WHERE idcategoryserie IN (${categoryIdsArray.join(',')})`;
            const result = await this.db.query(queryString);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getSeriesByIds(idSeries) {
        try {
            const tab = "serie";
            const placeholders = idSeries.map((_, i) => `$${i + 1}`).join(',');
            const queryString = `SELECT * FROM ${tab} WHERE id IN (${placeholders})`;
            const result = await this.db.query(queryString, idSeries);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getSerieByIdSerieApi(idserieapi){
        let tab = "serie"
        try {
            const result = await this.db.query(`SELECT * FROM ${tab} WHERE idapi=$1`, [idserieapi]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getAllDejaVu(userId){
        try {
            const tab = "alreadyseen";
            const typecontenu = "serie";

            const result = await this.db.query(`SELECT * FROM ${tab} WHERE iduser = $1 AND typecontenu = $2`, [userId, typecontenu]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getPlatform(idserieapi) {
        try {
            console.log("idserieapi : " + idserieapi)
            const url = `https://api.themoviedb.org/3/tv/${idserieapi}/watch/providers`;
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

    async deleteSerie(params) {
        const tab = "serie";
        let resultSerie;

        try {
            if (params.id) {
                const result = await this.db.query(`SELECT id FROM ${tab} WHERE idapi = $1`, [params.id]);
                if (result.rowCount === 0) {
                    throw new Error('Série non trouvée.');
                }
                const id = result.rows[0].id;
                await this.db.query(`DELETE FROM categoryparserie WHERE idserie = $1`, [id]);
                resultSerie = await this.db.query(`DELETE FROM ${tab} WHERE idapi = $1 RETURNING *`, [params.id]);
            } else if (params.name) {
                console.log(params.name)
                const result = await this.db.query(`SELECT id FROM ${tab} WHERE name = $1`, [params.name]);
                if (result.rowCount === 0) {
                    throw new Error('Série non trouvée.');
                }
                const id = result.rows[0].id;
                await this.db.query(`DELETE FROM categoryparserie WHERE idserie = $1`, [id]);

                resultSerie = await this.db.query(`DELETE FROM ${tab} WHERE name = $1 RETURNING *`, [params.name]);
            }

            return resultSerie;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateSerie(params, updateObject) {
        const tab = "serie";
        let resultSerie;
        try {
            if (params.id) {
                if (updateObject.name && !updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  name = $1 WHERE idapi = $2`, [updateObject.name, params.id]);
                }
                else if (!updateObject.name && updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  overview = $1 WHERE idapi = $2`, [updateObject.overview, params.id]);
                }
                else if (updateObject.name && updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  overview = $1, name = $2 WHERE idapi = $3
                    `, [updateObject.overview, updateObject.name, params.id]);
                }
            } else if (params.name) {
                if (updateObject.name && !updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  name = $1 WHERE name = $2`, [updateObject.name, params.name]);
                }
                else if (!updateObject.name && updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  overview = $1 WHERE name = $2`, [updateObject.overview, params.name]);
                }
                else if (updateObject.name && updateObject.overview){
                    resultSerie = await this.db.query(`UPDATE ${tab} SET  overview = $1, name = $2 WHERE name = $3
                    `, [updateObject.overview, updateObject.name, params.name]);
                }
            }

            return resultSerie;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

};