module.exports = class BaseDAO {
    constructor(db, tablename) {
        this.db = db
        this.tablename = tablename
    }

    insert(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        const query = `INSERT INTO ${this.tablename} (${keys.join(', ')}) VALUES (${placeholders})`;

        return this.db.query(query, values)

    }
}