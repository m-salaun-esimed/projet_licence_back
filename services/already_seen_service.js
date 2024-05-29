const AlreadySeenDao = require("../datamodel/already_seen_dao.js")

module.exports = class AlreadySeenService {
    constructor(db) {
        this.dao = new AlreadySeenDao(db, "moviealreadyseen")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }
}