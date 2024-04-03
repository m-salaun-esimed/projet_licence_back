const FavoriteDao = require("../datamodel/favorite_dao.js")
const bcrypt = require('bcrypt')

module.exports = class FavoriteService {
    constructor(db) {
        this.dao = new FavoriteDao(db, "favoritemovie")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }
}