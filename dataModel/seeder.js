module.exports = (userService, jwt) => {
    return new Promise (async (resolve,reject)=>{
        try{
            await userService.dao.db.query(`
                DROP TABLE IF EXISTS UserAccount;
            `);

            await userService.dao.db.query(`
                CREATE TABLE IF NOT EXISTS UserAccount (
                    id SERIAL PRIMARY KEY,
                    displayName VARCHAR(255) NOT NULL,
                    login VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    admin BOOLEAN NOT NULL
                );
            `)

            for (let i = 0; i < 5; i++) {
                const data = {
                    displayName : "user" + i,
                    login: "login" + i + "@gmail.com",
                    password : "azerty",
                    admin : false
                };
                userService.insertService(data)
            }
            resolve()
        }
        catch (e) {
            reject(e)
        }
    })
}