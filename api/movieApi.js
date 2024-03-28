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

    app.get("/getAllFavoriteByIdUser", jwt.validateJWT, async (req, res) => {
        try {
            let { iduser } = req.headers;
            const data = await movieService.dao.getAllFavoriteByIdUser(iduser);
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
            const randomMovies = getRandomMovies(movies, 7);
            const idMovies = randomMovies.map(movie => movie.idmovie);
            const selectedMovies = await movieService.dao.getMoviesByIds(idMovies);

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

    app.post("/postFavoriteMovie", jwt.validateJWT,  async (req, res) => {
        try {
            const { idMovieApi, idUser } = req.body;
            if (idMovieApi === undefined || idUser === undefined) {
                res.status(400).end();
                return;
            }

            const data = {
                idmovieapi : idMovieApi,
                iduser: idUser
            };
            const response = await movieService.dao.insertFavorite(data);
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

}
