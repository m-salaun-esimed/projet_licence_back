module.exports = async (userService, movieService, streamingService, categorieService, moviePlatformStreamingService, movieCategoryService) => {
    try {

        await categorieService.dao.db.query(`
            DROP TABLE IF EXISTS MoviePlatformStreaming ;
        `);

        await categorieService.dao.db.query(`
            DROP TABLE IF EXISTS MovieCategory ;
        `);

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
                nameFilmMaker VARCHAR(255) NOT NULL,
                date DATE, 
                overview VARCHAR(255) NOT NULL,
                note FLOAT NOT NULL
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS MoviePlatformStreaming (
                id SERIAL PRIMARY KEY,
                idMovie INT,
                idPlatform INT,
                FOREIGN KEY (idMovie) REFERENCES Movie(id),
                FOREIGN KEY (idPlatform) REFERENCES streamingPlatform(id)
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS MovieCategory (
                id SERIAL PRIMARY KEY,
                idMovie INT,
                idCategory INT,
                FOREIGN KEY (idMovie) REFERENCES Movie(id),
                FOREIGN KEY (idCategory) REFERENCES Category(id)
            );
        `);

        // ------------------------------------------SEEDER----------------------------------------------


        //-------------------------------------------PLATFORM--------------------------------------------
        let listDePlatform = ["netflix", "disney+", "Amazon"]
        for (let i = 0; i < 3; i++) {
            const data = {
                name: listDePlatform[i],
            };
            await streamingService.insertService(data);
        }

        //-------------------------------------------CATEGORY--------------------------------------------

        const fetch = require('node-fetch');

        const url = 'https://api.themoviedb.org/3/genre/movie/list';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
            }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données depuis l\'API');
        }
        const json = await response.json();
        const genreNames = json.genres.map(genre => genre.name);

        await Promise.all(genreNames.map(async name => {
            const data = { name };
            await categorieService.insertService(data);
        }));


        //-------------------------------------------USER--------------------------------------------

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

        //-------------------------------------------MOVIE--------------------------------------------
        let listMovie = ["spiderMan", "seigneur des anneaux", "sandMan", "Fight Club", "forrest gump",
            "burlesque", "interstellar", "onePiece red", "ligne verte", "alien", "matrix2", "narcos", "batman", "Predator", "Fast & furious"
        ]
        for (let i = 0; i < listMovie.length; i++) {
            const data = {
                name: listMovie[i],
                namefilmmaker: "nameFilmMaker" + i,
                date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
                overview: "description" + i,
                note: Math.random() * 5
            };
            await movieService.insertService(data);
        }


        //-------------------------------------------moviePlatformStreaming--------------------------------------------

        let listIdMovie = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        let listIdPlatform = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3]

        for (let i = 0; i < listIdPlatform.length; i++) {
            const data = {
                idMovie : listIdMovie[i],
                idPlatform : listIdPlatform[i]
            };
            await moviePlatformStreamingService.insertService(data);
        }

        //-------------------------------------------movieCategory--------------------------------------------

        let listIdCategory = [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5]

        for (let i = 0; i < listIdCategory.length; i++) {
            const data = {
                idMovie : listIdMovie[i],
                idCategory : listIdCategory[i]
            };
            await movieCategoryService.insertService(data);
        }

        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};