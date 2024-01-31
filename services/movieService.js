const MovieDao = require("../datamodel/movieDao.js")
const bcrypt = require('bcrypt')
const UserAccount = require('../datamodel/user')

module.exports = class MovieService {
    constructor(db) {
        this.dao = new MovieDao(db, "Movie")
    }
}