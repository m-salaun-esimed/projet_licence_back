const AlreadySeenDao = require("../datamodel/already_seen_dao.js")
const bcrypt = require('bcrypt')

module.exports = class AlreadySeenService {
    constructor(db) {
        this.dao = new AlreadySeenDao(db, "moviealreadyseen")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }
}