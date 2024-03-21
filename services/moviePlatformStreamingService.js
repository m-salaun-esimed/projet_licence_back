const MoviePlatformDao = require("../datamodel/moviePlatformDao.js")

module.exports = class MoviePlatformService {
    constructor(db) {
        this.dao = new MoviePlatformDao(db, "MoviePlatformStreaming")
    }

    insertService(data){
        return this.dao.insert(data)
    }
}