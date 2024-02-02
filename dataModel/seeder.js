module.exports = async (userService, movieService, streamingService, categorieService) => {
    try {
        await userService.dao.db.query(`
            DROP TABLE IF EXISTS UserAccount;
        `);

        await movieService.dao.db.query(`
            DROP TABLE IF EXISTS Movie;
        `);

        await streamingService.dao.db.query(`
            DROP TABLE IF EXISTS streamingPlatform;
        `);

        await categorieService.dao.db.query(`
            DROP TABLE IF EXISTS Category;
        `);


        await streamingService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS streamingPlatform (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        await categorieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS Category (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        await userService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS UserAccount (
                id SERIAL PRIMARY KEY,
                displayName VARCHAR(255) NOT NULL,
                login VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                admin BOOLEAN NOT NULL
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS Movie (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                idStreamingPlatform INTEGER REFERENCES streamingPlatform(id),
                idCategorys INTEGER NOT NULL,
                nameFilmMaker VARCHAR(255) NOT NULL,
                date DATE, 
                description VARCHAR(255) NOT NULL,
                moyenneNote FLOAT NOT NULL,
                type BOOLEAN 
            );
        `);
        let listDeSite = ["netflix", "disney+", "Amazon"]
        for (let i = 0; i < 3; i++) {
            const data = {
                name: listDeSite[i],
            };
            await streamingService.insertService(data);
        }

        let listDeCategory = ["super hero", "aventure", "thrillers", "comedie", "scientifique"]
        for (let i = 0; i < 5; i++) {
            const data = {
                name: listDeCategory[i],
            };
            await categorieService.insertService(data);
        }

        let listDeUser = ["Matthieu", "Leana", "Malo", "Carine", "Franck"]
        let listDeLogin = ["Matthieu@gmail.com", "Leana@gmail.com", "Malo@gmail.com", "Carine@gmail.com", "Franck@gmail.com"]

        for (let i = 0; i < 5; i++) {
            const data = {
                displayName: listDeUser[i],
                login: listDeLogin[i],
                password: "azerty",
                admin: false
            };
            await userService.insertService(data);
        }

        let listMovie = ["spiderMan", "seigneur des anneaux", "sandMan", "Fight Club", "forrest gump"]
        let listIdStreamingPlatform = [2, 3 ,2, 3, 1]
        let listIdCategory = [1, 2, 1, 3, 4]

        for (let i = 0; i < 5; i++) {
            const data = {
                name: listMovie[i],
                idStreamingPlatform: listIdStreamingPlatform[i],
                idCategorys: listIdCategory[i],
                nameFilmMaker: "nameFilmMaker" + i,
                date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
                description: "description" + i,
                moyenneNote: Math.random() * 5,
                type: 0
            };
            await movieService.insertService(data);
        }

        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};