const CategorieDao = require("../datamodel/category_movie_dao.js")
const bcrypt = require('bcrypt')

module.exports = class CategorieService {
    constructor(db) {
        this.dao = new CategorieDao(db, "Category")
    }

    insertService(data){
        return this.dao.insert(data)
    }

    async findByApiId(idApi){
        const data = await this.dao.findByApiIdDao(idApi)
        return data
    }
}