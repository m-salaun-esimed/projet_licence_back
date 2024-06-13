const UserDao = require("../datamodel/user_dao.js")
const bcrypt = require('bcryptjs')

module.exports = class UserService {
    constructor(db) {
        this.dao = new UserDao(db, "UserAccount")
    }

    async validatePassword(login, password){
        const user = await this.dao.getByLogin(login.trim())
        return this.comparePassword(password, user.password)
    }
    
    hashPassword(password) {

        var saltRounds = parseInt(process.env.BCRYPT_COST, 10);
        if (saltRounds === undefined) {
            const { env } = process;
            const read_base64_json = function(varName) {
                try {
                    return JSON.parse(Buffer.from(env[varName], "base64").toString())
                } catch (err) {
                    throw new Error(`no ${varName} environment variable`)
                }
            };
            const variables = read_base64_json('PLATFORM_VARIABLES')
            saltRounds = variables["BCRYPT_COST"]
        }
        return bcrypt.hashSync(password, saltRounds)
    }

    insertService(data) {
        const dataHash = {
            displayName : data.displayName,
            login : data.login,
            password : this.hashPassword(data.password),
            admin : data.admin
        }
        return this.dao.insert(dataHash)
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

    async updatePwd(login, pwd){
        pwd = this.hashPassword(pwd);
        return this.dao.updatePwd(login, pwd)
    }
}