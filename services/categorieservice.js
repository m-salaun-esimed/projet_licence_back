const CategorieDao = require("../dataModel/categoriedao.js")
const bcrypt = require('bcrypt')
const Categorie = require("../dataModel/categorie");

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