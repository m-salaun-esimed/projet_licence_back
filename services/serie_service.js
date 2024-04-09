const SerieDao = require("../datamodel/serie_dao.js")

module.exports = class SerieService {
    constructor(db) {
        this.dao = new SerieDao(db, "serie")
    }

    insertService(data) {
        return this.dao.insert(data)
    }
}