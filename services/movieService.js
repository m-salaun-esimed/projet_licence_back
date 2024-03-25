const MovieDao = require("../datamodel/movieDao.js")
const bcrypt = require('bcrypt')
const Movie = require('../datamodel/movie')

module.exports = class MovieService {
    constructor(db) {
        this.dao = new MovieDao(db, "movie")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }


}