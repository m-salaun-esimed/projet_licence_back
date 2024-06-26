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

    async getFriendsRequestsSend(idUser){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablenameFriend} WHERE sender_id = $1`, [idUser]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    async getFriendsRequestsReceived(idUser){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablenameFriend} WHERE receiver_id = $1 AND status = 'pending'`, [idUser]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getNotification(idnotification){
        try {
            const result = await this.db.query(`SELECT * FROM ${this.tablenameNotification} WHERE id = $1`, [idnotification]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getAmi(idUser){
        try {
            const friends  = await this.db.query(`
            SELECT * FROM ${this.tablenameFriend} 
            WHERE (sender_id = $1 OR receiver_id = $1) 
            AND status = 'accepted'
        `, [idUser]);

            const friendIdsSet = new Set();

            friends.rows.forEach(friend => {
                if (friend.sender_id === idUser) {
                    friendIdsSet.add(friend.receiver_id);
                } else {
                    friendIdsSet.add(friend.sender_id);
                }
            });

            const friendIds = Array.from(friendIdsSet);

            console.log("IDs des amis de l'utilisateur :", friendIds);
            return friendIds;
        } catch (error) {
            throw error;
        }
    }




    async validerDemande(friendrequestid){
        const currentDate = new Date().toISOString();
        try {
            const result = await this.db.query(`
                UPDATE ${this.tablenameFriend}
                SET status = 'accepted', accepted_at = $1
                WHERE id = $2
            `, [currentDate, friendrequestid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async rejeterDemande(friendrequestid){
        const currentDate = new Date().toISOString();
        try {
            const result = await this.db.query(`
                UPDATE ${this.tablenameFriend}
                SET status = 'rejected', accepted_at = $1
                WHERE id = $2
            `, [currentDate, friendrequestid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async validerNotification(notificationid){
        try {
            const result = await this.db.query(`
                UPDATE ${this.tablenameNotification}
                SET is_read = true
                WHERE id = $1
            `, [notificationid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    async deleteFriend(idfriend, iduser){
        console.log("iduser :" + iduser)
        try {
            const result1 = await this.db.query(`
            DELETE FROM ${this.tablenameFriend}
            WHERE sender_id = $1 AND receiver_id = $2
        `, [iduser, idfriend]);
            const result2 = await this.db.query(`
            DELETE FROM ${this.tablenameFriend}
            WHERE sender_id = $1 AND receiver_id = $2
        `, [idfriend, iduser]);

            return { result1, result2 };
        } catch (error) {
            throw error;
        }
    }


};