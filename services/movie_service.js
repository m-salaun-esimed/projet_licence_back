const MovieDao = require("../datamodel/movie_dao.js")

module.exports = class MovieService {
    constructor(db) {
        this.dao = new MovieDao(db, "movie")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }

    async insertPlatform(data){
        return await this.dao.insertPlatform(data);
    }

    async getMovies(){
        return await this.dao.getAllMovie();
    }

    async addUrl(url, idapi){
        await this.dao.addUrl(url, idapi);
    }

    async addPlatform(platforms, idapi){
        await this.dao.addPlatform(platforms, idapi);
    }
}