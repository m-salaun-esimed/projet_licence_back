const BaseDAO = require('./basedao')

module.exports = class SerieCategoryDao extends BaseDAO {
    constructor(db, namespace) {
        super(db, namespace)
    }

    async findByApiIdDao(idApi){
        const result = await this.db.query(`SELECT id FROM ${this.tablename} WHERE idapi = $1`, [idApi]);
        return result.rows;
    }

    async getserieCategory(){
        const result = await this.db.query(`SELECT * FROM ${this.tablename}`);
        return result.rows;
    }
};