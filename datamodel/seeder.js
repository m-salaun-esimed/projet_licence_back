const fetch = require("node-fetch");
const fetchMovie = require("node-fetch");
module.exports =  (userService, movieService, categorieService, movieCategoryService, serieCategoryService, serieService, categoryParSerieService) => {
    return new Promise(async (resolve, reject) => {
    try {
        //------------------------------------DROP TABLE-----------------------------------------
        //
        // await serieService.dao.db.query(`
        //     DROP TABLE IF EXISTS movieplatform;
        // `);
        //
        // await serieService.dao.db.query(`
        //     DROP TABLE IF EXISTS serieplatform;
        // `);
        //
        // await movieService.dao.db.query(`
        //     DROP TABLE IF EXISTS Favorite;
        // `);
        //
        // await movieService.dao.db.query(`
        //     DROP TABLE IF EXISTS AlreadySeen;
        // `);
        //
        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS MovieCategory ;
        // `);
        //
        // await categoryParSerieService.dao.db.query(`
        //     DROP TABLE IF EXISTS categoryparserie ;
        // `);
        //
        // await serieCategoryService.dao.db.query(`
        //     DROP TABLE IF EXISTS categoryserie;
        // `);
        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS friends_requests ;
        // `);
        //
        // await categorieService.dao.db.query(`
        //     DROP TABLE IF EXISTS notifications ;
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
        //
        // await serieService.dao.db.query(`
        //     DROP TABLE IF EXISTS serie;
        // `);
        //
        // await serieService.dao.db.query(`
        //     DROP TABLE IF EXISTS platforms;
        // `);

        // ------------------------------------CREATE TABLE-----------------------------------------

        await categorieService.dao.db.query(`
            CREATE TABLE Category (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                idApi INT
            );
        `);

        await serieCategoryService.dao.db.query(`
            CREATE TABLE categoryserie (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            idApi INT
            );
        `);

        await userService.dao.db.query(`
            CREATE TABLE UserAccount (
                id SERIAL PRIMARY KEY,
                displayName VARCHAR(255) UNIQUE NOT NULL,
                login VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                admin BOOLEAN NOT NULL
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE Movie (
                id SERIAL PRIMARY KEY,
                idApi INT NOT NULL UNIQUE ,
                name VARCHAR(255) NOT NULL,
                date VARCHAR(255),
                urlTrailer VARCHAR(255),
                overview TEXT NOT NULL,
                note FLOAT NOT NULL,
                poster_path TEXT,
                backdrop_path TEXT
            );
        `);

        await serieService.dao.db.query(`
            CREATE TABLE serie (
            id SERIAL PRIMARY KEY,
            idApi INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            date VARCHAR(255),
            urlTrailer VARCHAR(255),
            overview TEXT NOT NULL,
            note FLOAT NOT NULL,
            poster_path TEXT,
            backdrop_path TEXT
            );
        `);


        await movieCategoryService.dao.db.query(`
            CREATE TABLE MovieCategory (
                id SERIAL PRIMARY KEY,
                idMovie INT,
                idmovieapi INT,
                idCategory INT,
                FOREIGN KEY (idMovie) REFERENCES Movie(id),
                FOREIGN KEY (idmovieapi) REFERENCES Movie(idapi),
                FOREIGN KEY (idCategory) REFERENCES Category(id)
            );
        `);

        await categoryParSerieService.dao.db.query(`
            CREATE TABLE  categoryparserie (
            id SERIAL PRIMARY KEY,
            idSerie INT,
            idCategorySerie INT,
            FOREIGN KEY (idSerie) REFERENCES serie(id),
            FOREIGN KEY (idCategorySerie) REFERENCES categoryserie(id)
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE Favorite (
                id SERIAL PRIMARY KEY,
                idapi INT,
                idUser INT,
                typeContenu VARCHAR(255),
                FOREIGN KEY (idUser) REFERENCES UserAccount(id)
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE  AlreadySeen (
                id SERIAL PRIMARY KEY,
                idApi INT,
                idUser INT,
                typeContenu VARCHAR(255),
                FOREIGN KEY (idUser) REFERENCES UserAccount(id)
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE  notifications (
            id SERIAL PRIMARY KEY,
            receiver_id INT,
            sender_id INT,
            notification_type VARCHAR(50),
            notification_message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (receiver_id) REFERENCES UserAccount(id),
            FOREIGN KEY (sender_id) REFERENCES UserAccount(id)
            );
        `);
        await movieService.dao.db.query(`
            CREATE TABLE friends_requests (
            id SERIAL PRIMARY KEY,
            sender_id INT,
            receiver_id INT,
                status VARCHAR(20) DEFAULT 'pending', -- Peut être 'pending', 'accepted' ou 'rejected'
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            accepted_at TIMESTAMP,
            notification_id INT,
            FOREIGN KEY (sender_id) REFERENCES UserAccount(id),
            FOREIGN KEY (receiver_id) REFERENCES UserAccount(id),
            FOREIGN KEY (notification_id) REFERENCES notifications(id)
            );
        `);

        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS platforms (
                id SERIAL PRIMARY KEY,
                idapi INT UNIQUE,
                provider_name VARCHAR(50),
                logo_path VARCHAR(50)
            );
        `);
        await movieService.dao.db.query(`
            CREATE TABLE IF NOT EXISTS MoviePlatform (
                id SERIAL PRIMARY KEY,
                idmovieapi INT,
                idplatformapi INT,
                FOREIGN KEY (idmovieapi) REFERENCES Movie(idapi),
                FOREIGN KEY (idplatformapi) REFERENCES platforms(idapi)
            );
        `);


        await serieService.dao.db.query(`
            CREATE TABLE SeriePlatform (
                id SERIAL PRIMARY KEY,
                idSerie INT,
                idPlatform INT,
                FOREIGN KEY (idSerie) REFERENCES serie(id),
                FOREIGN KEY (idPlatform) REFERENCES platforms(id)
            );
        `);

        // // ------------------------------------------SEEDER----------------------------------------------
        //
        //
        // //-------------------------------------------CATEGORY MOVIE--------------------------------------------
        //
        const fetch = require('node-fetch');
        console.log("cat avant fecth")
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=fr';
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
        //-------------------------------------------CATEGORY SERIE--------------------------------------------
        const urlSerieCategory = 'https://api.themoviedb.org/3/genre/tv/list?language=fr';
        const optionsSerieCategory = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
            }
        };
        console.log("cat apres fecth")

        const responseSerieCategory = await fetch(urlSerieCategory, optionsSerieCategory);
        if (!responseSerieCategory.ok) {
            throw new Error('Erreur lors de la récupération des données depuis l\'API');
        }
        const jsonSerieCategory = await responseSerieCategory.json();
        const genreNamesSerieCategory = jsonSerieCategory.genres.map(genre => genre.name);
        const genreIdsSerieCategory = jsonSerieCategory.genres.map(genre => genre.id);
        console.log("genreNames serie" + genreNamesSerieCategory)
        await Promise.all(genreNamesSerieCategory.map(async (name, index) => {
            const data = {
                name,
                idApi: genreIdsSerieCategory[index]
            };
            await serieCategoryService.insertService(data);
        }));

        // -------------------------------------------USER--------------------------------------------

        let listDeUser = [ "Leana", "Malo", "Carine", "Franck"]
        let listDeLogin = ["leana@gmail.com", "malo@gmail.com", "carine@gmail.com", "franck@gmail.com"]

        for (let i = 0; i < 4; i++) {
            const data = {
                displayName: listDeUser[i],
                login: listDeLogin[i],
                password: "azerty",
                admin: false
            };
            await userService.insertService(data);
        }

        const data = {
            displayName: "Matthieu",
            login: "matthieu@gmail.com",
            password: "azerty",
            admin: true
        };
        await userService.insertService(data);

        //-------------------------------------------MOVIE--------------------------------------------


        const fetchMovie = require('node-fetch');
        for(let i = 1; i < 60; i++){
            const urlMovie = `https://api.themoviedb.org/3/trending/movie/day?language=fr&page=${i}`;
            const optionsMovie = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
                }
            };
            const responseMovie = await fetchMovie(urlMovie, optionsMovie);
            if (!responseMovie.ok) {
                throw new Error('Erreur lors de la récupération des données depuis l\'API');
            }

            const jsonMovie = await responseMovie.json();
            const titles = jsonMovie.results.map(movie => movie.title);
            const overviews = jsonMovie.results.map(movie => movie.overview);
            const genreIds = jsonMovie.results.map(movie => movie.genre_ids);
            const idapi = jsonMovie.results.map(movie => movie.id);
            const dates = jsonMovie.results.map(movie => movie.release_date);
            const poster_path = jsonMovie.results.map(movie => movie.poster_path);
            const backdrop_path = jsonMovie.results.map(movie => movie.backdrop_path);
            const vote_average = jsonMovie.results.map(movie => movie.vote_average);
            await Promise.all(titles.map(async (movieTitle, index) => {
                const dataMovie = {
                    idapi: idapi[index],
                    name: movieTitle,
                    overview: overviews[index],
                    note: vote_average[index],
                    poster_path: poster_path[index],
                    backdrop_path: backdrop_path[index]
                };

                if (dates[index]) {
                    dataMovie.date = dates[index];
                }

                const responseId = await movieService.insertService(dataMovie);

                for (let j = 0; j < genreIds[index].length; j ++){
                    const categorieId = await categorieService.findByApiId(genreIds[index][j]);
                    if (categorieId && categorieId.length > 0) {
                        const dataRelation = {
                            idmovie: responseId,
                            idmovieapi:dataMovie.idapi,
                            idcategory: categorieId[0].id
                        };
                        await movieCategoryService.insertService(dataRelation);
                    }
                }
            }));
        }

        // for(let i = 1; i < 500; i++){
        //     const urlMovie = `https://api.themoviedb.org/3/movie/${i}?language=fr-FR`;
        //         const optionsMovie = {
        //             method: 'GET',
        //             headers: {
        //                 accept: 'application/json',
        //                 Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
        //             }
        //         };
        //         const responseMovie = await fetchMovie(urlMovie, optionsMovie);
        //         console.log(responseMovie)
        //         if (responseMovie.status === 200) {
        //             console.log(i)
        //             console.log(responseMovie)
        //                 const jsonMovie = await responseMovie.json();
        //                 const titles =  jsonMovie.title;
        //                 // const dates = jsonMovie.results.map(movie => movie.release_date);
        //                 const overviews = jsonMovie.overview;
        //                 const genreIds = jsonMovie.genres;
        //                 const idapi = jsonMovie.id;
        //                 const poster_path = jsonMovie.poster_path;
        //                 const backdrop_path = jsonMovie.backdrop_path;
        //                 const vote_average = jsonMovie.vote_average;
        //                 console.log(jsonMovie)
        //
        //                 const dataMovie  = {
        //                     idapi: idapi,
        //                     name: titles,
        //                     namefilmmaker: "nameFilmMaker",
        //                     overview: overviews,
        //                     note: vote_average,
        //                     poster_path: poster_path,
        //                     backdrop_path: backdrop_path
        //                 }
        //                 console.log(dataMovie)
        //                 const responseId = await movieService.insertService(dataMovie);
        //                 console.log(responseId)
        //                 console.log(genreIds.length)
        //                     for (let j = 0; j < genreIds.length; j ++){
        //                         const categorieId = await categorieService.findByApiId(genreIds[j].id);
        //                         const dataRelation = {
        //                             idmovie: responseId,
        //                             idcategory: categorieId[0].id
        //                         };
        //                         await movieCategoryService.insertService(dataRelation);
        //                     }
        //         }
        // }
        //-------------------------------------------Serie--------------------------------------------
        //60
        for(let i = 1; i < 60; i++){
            const urlSerie = `https://api.themoviedb.org/3/trending/tv/day?language=fr&page=${i}`;
            const optionsSerie = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
                }
            };
            const responseSerie = await fetchMovie(urlSerie, optionsSerie);
            if (!responseSerie.ok) {
                throw new Error('Erreur lors de la récupération des données depuis l\'API');
            }

            const jsonMovie = await responseSerie.json();
            const titles = jsonMovie.results.map(movie => movie.name);

            // const dates = jsonMovie.results.map(movie => movie.first_air_date);
            const overviews = jsonMovie.results.map(movie => movie.overview);
            const genreIds = jsonMovie.results.map(movie => movie.genre_ids);
            const idapi = jsonMovie.results.map(movie => movie.id);
            const dates = jsonMovie.results.map(movie => movie.first_air_date);
            const poster_path = jsonMovie.results.map(movie => movie.poster_path);
            const backdrop_path = jsonMovie.results.map(movie => movie.backdrop_path);
            const vote_average = jsonMovie.results.map(movie => movie.vote_average);
            await Promise.all(titles.map(async (movieTitle, index) => {
                const dataMovie  = {
                    idapi: idapi[index],
                    name: movieTitle,
                    overview: overviews[index],
                    note: vote_average[index],
                    poster_path: poster_path[index],
                    backdrop_path: backdrop_path[index]
                };

                if (dates[index]) {
                    dataMovie.date = dates[index];
                }

                const responseId = await serieService.insertService(dataMovie);
                for (let j = 0; j < genreIds[index].length; j ++){
                    const categorieId = await serieCategoryService.findByApiId(genreIds[index][j]);
                    if (categorieId && categorieId.length > 0) {                        const dataRelation = {
                            idSerie: responseId,
                            idCategorySerie: categorieId[0].id
                        };
                        await categoryParSerieService.insertService(dataRelation);
                    }
                }
            }));
        }

        // for(let i = 1; i < 500; i++){
        //     const urlMovie = `https://api.themoviedb.org/3/tv/${i}?language=fr-FR`;
        //     const optionsMovie = {
        //         method: 'GET',
        //         headers: {
        //             accept: 'application/json',
        //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
        //         }
        //     };
        //     const responseMovie = await fetchMovie(urlMovie, optionsMovie);
        //     console.log(responseMovie)
        //     if (responseMovie.status === 200) {
        //         console.log(i)
        //         console.log(responseMovie)
        //         const jsonMovie = await responseMovie.json();
        //         const titles =  jsonMovie.name;
        //         // const dates = jsonMovie.results.map(movie => movie.release_date);
        //         const overviews = jsonMovie.overview;
        //         const genreIds = jsonMovie.genres;
        //         const idapi = jsonMovie.id;
        //         const poster_path = jsonMovie.poster_path;
        //         const backdrop_path = jsonMovie.backdrop_path;
        //         const vote_average = jsonMovie.vote_average;
        //         console.log(jsonMovie)
        //
        //         const dataMovie  = {
        //             idapi: idapi,
        //             name: titles,
        //             namefilmmaker: "nameFilmMaker",
        //             overview: overviews,
        //             note: vote_average,
        //             poster_path: poster_path,
        //             backdrop_path: backdrop_path
        //         }
        //         console.log(dataMovie)
        //         const responseId = await serieService.insertService(dataMovie);
        //         console.log(responseId)
        //         console.log(genreIds.length)
        //         for (let j = 0; j < genreIds.length; j ++){
        //             const categorieId = await serieCategoryService.findByApiId(genreIds[j].id);
        //             const dataRelation = {
        //                 idSerie: responseId,
        //                 idCategorySerie: categorieId[0].id
        //             };
        //             await categoryParSerieService.insertService(dataRelation);
        //         }
        //     }
        // }

        //-------------------------------------Trailer Movie-------------------------------------------

        const movies = await movieService.getMovies();

        for (const movie of movies) {
            if (!movie.urltrailer){
                // console.log(`Movie ID: ${movie.idapi}`);
                const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.idapi}/videos?language=fr-FR`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM' // Replace with your actual API key
                    }
                };

                try {
                    const response = await fetch(trailerUrl, options);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des données depuis l\'API');
                    }

                    const json = await response.json();

                    // Access trailer data
                    const trailer = json.results?.[0];
                    if (trailer && trailer.site?.toLowerCase() === 'youtube') { // Check trailer object and site property (case-insensitive)
                        // console.log(`Trailer URL: https://www.youtube.com/watch?v=${trailer.key}`);
                        const url = `https://www.youtube.com/watch?v=${trailer.key}`;
                        await movieService.addUrl(url, movie.idapi);
                    } else {
                        // console.log('No trailer found for this movie or trailer not from YouTube');
                    }
                } catch (error) {
                    console.error('Error fetching trailer or poster data:', error);
                }
                // console.log('---'); // Separator for each movie
            }
        }

        //-------------------------------------Trailer Serie-------------------------------------------

        const series = await serieService.getSeries();

        for (const serie of series) {
            if (!serie.urltrailer){
                // console.log(`Movie ID: ${serie.idapi}`);
                const trailerUrl = `https://api.themoviedb.org/3/tv/${serie.idapi}/videos?language=fr-FR`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM' // Replace with your actual API key
                    }
                };

                try {
                    const response = await fetch(trailerUrl, options);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des données depuis l\'API');
                    }

                    const json = await response.json();
                    const trailer = json.results?.[0];
                    if (trailer && trailer.site?.toLowerCase() === 'youtube') { // Check trailer object and site property (case-insensitive)
                        // console.log(`Trailer URL: https://www.youtube.com/watch?v=${trailer.key}`);
                        const url = `https://www.youtube.com/watch?v=${trailer.key}`;
                        await serieService.addUrl(url, serie.idapi);
                    } else {
                        // console.log('No trailer found for this serie or trailer not from YouTube');
                    }
                } catch (error) {
                    console.error('Error fetching trailer or poster data:', error);
                }
                // console.log('---'); // Separator for each movie
            }
        }

        //------------------------------------platforms--------------------------------------------

        const platformName = ["Amazon Video", "Amazon Prime Video", "Netflix","Apple TV","Disney Plus","Canal+",
            "Canal VOD", "Crunchyroll", "OCS Go", "OCS Amazon Channel", "YouTube Premium",
            "Netflix basic with Ads", "Max", "TF1+", "Paramount+ Amazon Channel"];
        const idapi = [10,119,8,2,337, 381,58, 283, 56,685, 188,    1796, 1899, 1754, 582];

        for(let i = 0; i < platformName.length; i++){
            const dataPlatform = {
                idapi : idapi[i],
                provider_name : platformName[i]
            }
            await movieService.insertPlatform(dataPlatform);
        }

        //----------------------------------platforms movie ----------------------------------------

        for (const movie of movies) {
            const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.idapi}/watch/providers`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTM4ZTJiMmRjYjIyZjA1OGRlZTY5NmFlYzJjOWVhZCIsInN1YiI6IjY1Zjk4M2Y0YWJkZWMwMDE2MzZhYjhiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BLey_V_q7MHRPOaRlFa_ztrNevx2dXOq1U5LRRcAKVM'
                }
            };
            try {
                const response = await fetch(trailerUrl, options);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données depuis l\'API');
                }
                const data = await response.json();
                if (data.results.FR && data.results.FR.flatrate) {
                    await movieService.addPlatform(data.results.FR.flatrate, movie.idapi);
                } else {
                    console.log(`No FR flatrate data available for movie ID: ${movie.idapi}`);
                }
            } catch (error) {
                console.error('Error fetching trailer or poster data:', error);
            }
        }


        resolve()
    }catch (error) {
        if (error.code === '42P07') {  // Code for "table already exists" in PostgreSQL
            console.log("Table already exists.");
            resolve()
        } else {
            console.error("An error occurred:", error);
            throw error;
        }
    }
    })
};