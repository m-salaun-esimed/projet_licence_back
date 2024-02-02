const MovieDao = require("../datamodel/movieDao.js")
const bcrypt = require('bcrypt')
const Movie = require('../datamodel/movie')

module.exports = class MovieService {
    constructor(db) {
        this.dao = new MovieDao(db, "movie")
    }

    insertService(data){
        return this.dao.insert(new Movie(data.name, data.idStreamingPlatform, data.idCategorys,
        data.nameFilmMaker, data.date,data.description, data.moyenneNote, data.type))
    }
}