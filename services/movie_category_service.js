const MovieCategoryDao = require("../datamodel/movie_category_dao.js")

module.exports = class MovieCategoryService {
    constructor(db) {
        this.dao = new MovieCategoryDao(db, "moviecategory")
    }

    insertService(data) {
        return this.dao.insert(data)
    }
}