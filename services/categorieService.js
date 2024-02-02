const CategorieDao = require("../datamodel/categorieDao.js")
const bcrypt = require('bcrypt')
const Categorie = require("../dataModel/categorie");

module.exports = class CategorieService {
    constructor(db) {
        this.dao = new CategorieDao(db, "Category")
    }

    insertService(data){
        return this.dao.insert(new Categorie(data.name))
    }
}