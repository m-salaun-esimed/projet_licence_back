const SerieCategoryDao = require("../datamodel/serie_category_dao.js")

module.exports = class SerieCategoryService {
    constructor(db) {
        this.dao = new SerieCategoryDao(db, "categoryserie")
    }

    insertService(data) {
        return this.dao.insert(data)
    }

    async findByApiId(idApi){
        const data = await this.dao.findByApiIdDao(idApi)
        return data
    }
}