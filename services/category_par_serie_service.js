const CategoryParSerieDao = require("../datamodel/category_par_serie_dao.js")

module.exports = class CategoryParSerieService {
    constructor(db) {
        this.dao = new CategoryParSerieDao(db, "categoryparserie")
    }

    insertService(data) {
        return this.dao.insert(data)
    }
}