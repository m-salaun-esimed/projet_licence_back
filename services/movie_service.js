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
}