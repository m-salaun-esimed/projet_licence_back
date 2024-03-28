const MovieCategoryDao = require("../dataModel/moviecategorydao.js")

module.exports = class MovieCategoryService {
    constructor(db) {
        this.dao = new MovieCategoryDao(db, "MovieCategory")
    }

    insertService(data) {
        return this.dao.insert(data)
    }
}