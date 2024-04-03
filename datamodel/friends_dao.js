const BaseDAO = require('./basedao')

module.exports = class FriendsDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
        this.tablenameFriend = "friends_requests"
        this.tablenameNotification = "notifications"

    }

    async insertNotification(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${this.tablenameNotification} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
        const result = await this.db.query(query, values);
        const insertedId = result.rows[0].id;
        return insertedId;
    }


    async insertFriend(data){
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${this.tablenameFriend} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;

        return this.db.query(query, values)
    }

    async getFriendsRequests(idUser){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablenameFriend} WHERE sender_id = ${idUser}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getNotification(idUser){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablenameNotification} WHERE receiver_id = ${idUser}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};