module.exports = class BaseDAO {
    constructor(db, tablename) {
        this.db = db
        this.tablename = tablename
    }

    async insert(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${this.tablename} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;

        const result = await this.db.query(query, values);
        const insertedId = result.rows[0].id;

        return insertedId;
    }

    async insertPlatform(data){
        const tablename = "platform"
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${tablename} (${keys.join(', ')}) VALUES (${placeholders})`;
        return this.db.query(query, values)

    }
}