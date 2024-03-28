const MovieDao = require("../dataModel/moviedao.js")
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