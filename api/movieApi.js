module.exports = (app, movieService, jwt) => {
    app.get("/movie", jwt.validateJWT, async (req, res) => {
        try {
            const data = await movieService.dao.getAllMovie();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/movieByIdMovieApi", jwt.validateJWT, async (req, res) => {
        try {
            let { idmovieapi } = req.headers;

            const data = await movieService.dao.getMovieByIdMovieApi(idmovieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/getRandomMovies",jwt.validateJWT, async (req, res) => {
        try {
            const { categoryids } = req.headers;
            const categoryIdsArray = categoryids.split(',').map(id => parseInt(id));

            const movies = await movieService.dao.getMoviesByCategories(categoryIdsArray);
            const response = await movieService.dao.getAllDejaVu(req.user.id);
            const alreadySeenIds = response.map(movie => movie.idmovieapi);

            if (movies.length < 5){
                return res.status(500).json({ error: 'Pas assez de film' });
            }

            const randomMovies = await getRandomMovies(movies, 5, req.user.id);
            const idMovies = randomMovies.map(movie => movie.idmovie);
            const selectedMovies = await movieService.dao.getMoviesByIds(idMovies);


            for (let i = 0; i < selectedMovies.length; i++){
                if (alreadySeenIds.includes(selectedMovies[i].idapi)) {
                    return res.redirect('/getRandomMovies');
                }
            }
            res.json(selectedMovies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    function getRandomMovies(movies, num) {
        const randomMovies = [];
        const totalMovies = movies.length;
        const indices = new Set();

        while (indices.size < num) {
            const randomIndex = Math.floor(Math.random() * totalMovies);
            indices.add(randomIndex);
        }
        indices.forEach(index => {
            randomMovies.push(movies[index]);
        });

        return randomMovies;
    }

    app.get("/platform", jwt.validateJWT, async (req, res) => {
        try {
            const { idmovieapi } = req.headers;
            const data = await movieService.dao.getPlatform(idmovieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    // async function getRandomMovies(movies, num, userId) {
    //     const randomMovies = [];
    //     const totalMovies = movies.length;
    //     const response = await movieService.dao.getAllDejaVu(userId);
    //
    //     const alreadySeenIds = response.map(movie => movie.idmovieapi);
    //
    //     console.log("alreadySeenIds : " + alreadySeenIds)
    //     const indices = new Set();
    //     while (indices.size < num) {
    //         const randomIndex = Math.floor(Math.random() * totalMovies);
    //         if (!(alreadySeenIds.includes(movies[randomIndex].idapi))) {
    //             indices.add(randomIndex);
    //         }
    //     }
    //
    //     indices.forEach(index => {
    //         randomMovies.push(movies[index]);
    //     });
    //     console.log(randomMovies)
    //     return randomMovies;
    // }
}
