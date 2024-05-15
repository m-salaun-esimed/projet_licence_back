const BaseDAO = require('./basedao')

module.exports = class UserDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async getAllUsers() {
        try {
            const result = await this.db.query(`SELECT displayName FROM ${this.tablename}`);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getIdUser(login) {
        try {
            const result = await this.db.query("SELECT id FROM useraccount WHERE login=$1", [ login ] );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    async searchdisplaynames(recherche) {
        try {
            const query = "SELECT id, displayname FROM useraccount WHERE displayname ILIKE $1";

            const result = await this.db.query(query, [`%${recherche}%`]);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    async getIdUserByDisplayName(displayName){
        try {
            const result = await this.db.query("SELECT id FROM useraccount WHERE displayname=$1", [ displayName ] );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getdisplaynamebyid(iduser){
        try {
            const result = await this.db.query("SELECT id,displayname FROM useraccount WHERE id=$1", [ iduser ] );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getEstAdmin(iduser){
        try {
            const result = await this.db.query("SELECT admin FROM useraccount WHERE id=$1", [ iduser ] );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async insertUser(data){
        return super.insert(data);
    }

    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getByDisplayName(displayName){
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE displayName=$1", [ displayName ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    getDisplayNameByLogin(login){
        return new Promise((resolve, reject) =>
            this.db.query("SELECT displayName FROM useraccount WHERE displayName=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }
};