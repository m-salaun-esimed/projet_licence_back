const MovieDao = require("../datamodel/movie_dao.js")
const bcrypt = require('bcrypt')

module.exports = class MovieService {
    constructor(db) {
        this.dao = new MovieDao(db, "movie")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }
}