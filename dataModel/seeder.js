const fetch = require("node-fetch");
const fetchMovie = require("node-fetch");
module.exports = async (userService, movieService, streamingService, categorieService, moviePlatformStreamingService, movieCategoryService) => {
    try {

        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS MoviePlatformStreaming ;
        // `);
        //
        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS MovieCategory ;
        // `);
        //
        // await userService.dao.db.query(`
        //     DROP TABLE IF EXISTS UserAccount;
        // `);
        //
        // await movieService.dao.db.query(`
        //     DROP TABLE IF EXISTS Movie;
        // `);
        //
        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS Category;
        // `);



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
                name VARCHAR(255) NOT NULL,
                nameFilmMaker VARCHAR(255) NOT NULL,
                date DATE, 
                overview TEXT NOT NULL,
                note FLOAT NOT NULL
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


        //-------------------------------------------CATEGORY--------------------------------------------

        // const fetch = require('node-fetch');
        //
        // const url = 'https://api.themoviedb.org/3/genre/movie/list';
        // const options = {
        //     method: 'GET',
        //     headers: {
        //         accept: 'application/json',
        //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
        //     }
        // };
        //
        // const response = await fetch(url, options);
        // if (!response.ok) {
        //     throw new Error('Erreur lors de la récupération des données depuis l\'API');
        // }
        // const json = await response.json();
        // const genreNames = json.genres.map(genre => genre.name);
        // const genreIds = json.genres.map(genre => genre.id);
        //
        // await Promise.all(genreNames.map(async (name, index) => {
        //     const data = {
        //         name,
        //         idApi: genreIds[index]
        //     };
        //     await categorieService.insertService(data);
        // }));


        //-------------------------------------------USER--------------------------------------------

        // let listDeUser = ["Matthieu", "Leana", "Malo", "Carine", "Franck"]
        // let listDeLogin = ["Matthieu@gmail.com", "Leana@gmail.com", "Malo@gmail.com", "Carine@gmail.com", "Franck@gmail.com"]
        //
        // for (let i = 0; i < 5; i++) {
        //     const data = {
        //         displayName: listDeUser[i],
        //         login: listDeLogin[i],
        //         password: "azerty",
        //         admin: false
        //     };
        //     await userService.insertService(data);
        // }

        //-------------------------------------------MOVIE--------------------------------------------


        // const fetchMovie = require('node-fetch');
        //
        // for(let i = 1; i < 5; i++){
        //     const urlMovie = `https://api.themoviedb.org/3/trending/movie/day?language=fr&page=${i}`;
        //     const optionsMovie = {
        //         method: 'GET',
        //         headers: {
        //             accept: 'application/json',
        //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
        //         }
        //     };
        //
        //     const responseMovie = await fetchMovie(urlMovie, optionsMovie);
        //     if (!responseMovie.ok) {
        //         throw new Error('Erreur lors de la récupération des données depuis l\'API');
        //     }
        //     const jsonMovie = await responseMovie.json();
        //     const titles = jsonMovie.results.map(movie => movie.title);
        //     const dates = jsonMovie.results.map(movie => movie.release_date);
        //     const overviews = jsonMovie.results.map(movie => movie.overview);
        //     const genreIds = jsonMovie.results.map(movie => movie.genre_ids);
        //     console.log(genreIds)
        //     console.log(genreIds)
        //     await Promise.all(titles.map(async (movieTitle, index) => {
        //         const dataMovie  = {
        //             name: movieTitle,
        //             namefilmmaker: "nameFilmMaker" + index,
        //             date: dates[index],
        //             overview: overviews[index],
        //             note: Math.random() * 5
        //         };
        //
        //         const responseId = await movieService.insertService(dataMovie);
        //
        //         for (let j = 0; j < genreIds[index].length; j ++){
        //             console.log(`genreIds[${index}][${j}] : ` + genreIds[index][j])
        //             const categorieId = await categorieService.findByApiId(genreIds[index][j]);
        //             console.log("categorieId : " + categorieId[0].id)
        //             const dataRelation = {
        //                 idMovie: responseId,
        //                 idCategory: categorieId[0].id
        //             };
        //             console.log(dataRelation)
        //             await movieCategoryService.insertService(dataRelation);
        //         }
        //     }));
        //
        //
        // }


        //-------------------------------------------moviePlatformStreaming--------------------------------------------

        let listIdMovie = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

        // let listIdCategory = [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5]
        // for (let i = 0; i < listIdCategory.length; i++) {
        //     const data = {
        //         idMovie : listIdMovie[i],
        //         idCategory : listIdCategory[i]
        //     };
        //     await movieCategoryService.insertService(data);
        // }
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};