const UserDao = require("../datamodel/userDao.js")
const bcrypt = require('bcrypt')
const UserAccount = require('../datamodel/user')

module.exports = class UserService {
    constructor(db) {
        this.dao = new UserDao(db, "UserAccount")
    }

    async validatePassword(login, password){
        const user = await this.dao.getByLogin(login.trim())
        return this.comparePassword(password, user.password)
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }

    insertService(data) {
        return this.dao.insert(new UserAccount(data.displayName, data.login, this.hashPassword(data.password), data.admin))
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }

    async validateCreationCompte(displayName, login, password) {
        const userByLogin = await this.dao.getByLogin(login.trim());
        const userByDisplayName = await this.dao.getByDisplayName(displayName.trim());
        if (userByLogin === undefined && userByDisplayName === undefined) {
            return false;
        } else {
            return true;
        }
    }
}