module.exports =  (userService, movieService, categorieService, movieCategoryService) => {
    console.log("seeder : avant return")
    return new Promise(async (resolve, reject) => {
    try {
        console.log("debut du seeder")
        //------------------------------------DROP TABLE-----------------------------------------
        await categorieService.dao.db.query(`
            DROP TABLE IF EXISTS FavoriteMovie;
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

        await categorieService.dao.db.query(`
            DROP TABLE IF EXISTS Category;
        `);


        //------------------------------------CREATE TABLE-----------------------------------------
        console.log("création table")

        await categorieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS Category (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                idApi INT
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
                idApi INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                nameFilmMaker VARCHAR(255) NOT NULL,
                date DATE,
                overview TEXT NOT NULL,
                note FLOAT NOT NULL,
                poster_path TEXT,
                backdrop_path TEXT
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

        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS FavoriteMovie (
                id SERIAL PRIMARY KEY,
                idMovieApi INT,
                idUser INT,
                FOREIGN KEY (idUser) REFERENCES UserAccount(id)
            );
        `);

        // ------------------------------------------SEEDER----------------------------------------------


        //-------------------------------------------CATEGORY--------------------------------------------
        console.log("seeder category")

        const fetch = require('node-fetch');
        console.log("cat avant fecth")
        const url = 'https://api.themoviedb.org/3/genre/movie/list';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
            }
        };
        console.log("cat apres fecth")

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données depuis l\'API');
        }
        const json = await response.json();
        const genreNames = json.genres.map(genre => genre.name);
        const genreIds = json.genres.map(genre => genre.id);
        console.log("genreNames" + genreNames)
        await Promise.all(genreNames.map(async (name, index) => {
            const data = {
                name,
                idApi: genreIds[index]
            };
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


        const fetchMovie = require('node-fetch');

        for(let i = 1; i < 10; i++){
            const urlMovie = `https://api.themoviedb.org/3/trending/movie/day?language=fr&page=${i}`;
            const optionsMovie = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
                }
            };
            console.log("avant requete")
            const responseMovie = await fetchMovie(urlMovie, optionsMovie);
            if (!responseMovie.ok) {
                throw new Error('Erreur lors de la récupération des données depuis l\'API');
            }
            console.log("apres requete")

            const jsonMovie = await responseMovie.json();
            const titles = jsonMovie.results.map(movie => movie.title);
            const dates = jsonMovie.results.map(movie => movie.release_date);
            const overviews = jsonMovie.results.map(movie => movie.overview);
            const genreIds = jsonMovie.results.map(movie => movie.genre_ids);
            const idapi = jsonMovie.results.map(movie => movie.id);
            const poster_path = jsonMovie.results.map(movie => movie.poster_path);
            const backdrop_path = jsonMovie.results.map(movie => movie.backdrop_path);
            const vote_average = jsonMovie.results.map(movie => movie.vote_average);
            console.log("backdrop_path " + vote_average, "vote_average :" + backdrop_path)
            await Promise.all(titles.map(async (movieTitle, index) => {
                const dataMovie  = {
                    idapi: idapi[index],
                    name: movieTitle,
                    namefilmmaker: "nameFilmMaker" + index,
                    date: dates[index],
                    overview: overviews[index],
                    note: vote_average[index],
                    poster_path: poster_path[index],
                    backdrop_path: backdrop_path[index]
                };


                const responseId = await movieService.insertService(dataMovie);

                for (let j = 0; j < genreIds[index].length; j ++){
                    const categorieId = await categorieService.findByApiId(genreIds[index][j]);
                    const dataRelation = {
                        idMovie: responseId,
                        idCategory: categorieId[0].id
                    };
                    await movieCategoryService.insertService(dataRelation);
                }
            }));

        }

        resolve()
    } catch (e) {
        console.log(e)
        reject(e)
    }
    })
};