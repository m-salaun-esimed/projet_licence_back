const FriendsDao = require("../datamodel/friends_dao.js")
const bcrypt = require('bcrypt')

module.exports = class FriendsService {
    constructor(db) {
        this.dao = new FriendsDao(db, "friends_requests")
    }

    async insertService(data) {
        const insertedId = await this.dao.insert(data);
        return insertedId;
    }
}