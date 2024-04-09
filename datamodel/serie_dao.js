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
            const result = await this.db.query(`SELECT * FROM ${tab} WHERE idapi=${idserieapi}`);
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
            const platformsForFrance = data.results.FR;

            return platformsForFrance;
        } catch (error) {
            throw error;
        }
    }
};