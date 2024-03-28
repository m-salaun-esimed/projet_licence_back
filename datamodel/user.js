module.exports = class UserModel {
    constructor(displayName, login, password, admin) {
        this.displayName = displayName
        this.login = login
        this.password = password
        this.admin = admin
    }
}