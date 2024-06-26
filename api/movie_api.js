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

    app.get("/movie/ByidMovieApi", jwt.validateJWT, async (req, res) => {
        try {
            let { idmovieapi } = req.headers;
            if (idmovieapi === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
            const data = await movieService.dao.getMovieByIdMovieApi(idmovieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/movie/randomMovies",jwt.validateJWT, async (req, res) => {
        try {
            const { categoryids, platformsids } = req.headers;
            if (categoryids === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
            const categoryIdsArray = categoryids.split(',').map(id => parseInt(id));
            const platformsIdsApi = platformsids.split(',').map(idapi => parseInt(idapi));

            const movies = await movieService.dao.getMoviesByCategorys(categoryIdsArray, platformsIdsApi);
            const response = await movieService.dao.getAllDejaVu(req.user.id);
            const alreadySeenIds = response.map(movie => movie.idapi);
            if (movies.length < 5){
                return res.status(500).json({ error: 'Pas assez de film' });
            }

            const randomMovies = await getRandomMovies(movies, 5, req.user.id);
            const idMovies = randomMovies.map(movie => movie.idmovie);
            const selectedMovies = await movieService.dao.getMoviesByIds(idMovies);

            console.log(selectedMovies)
            for (let i = 0; i < selectedMovies.length; i++){
                if (alreadySeenIds.includes(selectedMovies[i].idapi)) {
                    return res.redirect('/movie/randomMovies');
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

    app.get("/movie/platform", jwt.validateJWT, async (req, res) => {
        try {
            const { idmovieapi } = req.headers;
            const data = await movieService.dao.getMoviePlatforms(idmovieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/platforms", jwt.validateJWT, async (req, res) => {
        try {
            const data = await movieService.dao.getPlatforms();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/movie/search",jwt.validateJWT, async (req, res) => {
        try {
            const { query } = req.headers;
            if (query === undefined){
                res.status(404).json({ error: 'La recherche est vide' });
            }
            console.log("query " + query)
            const movies = await movieService.dao.getMoviesSerieBySearch(query, req.user);
            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });


    app.delete("/movie", jwt.validateJWT, async (req, res) => {
        try {
            if (req.user.admin !== true) {
                return res.status(403).json({ error: 'Access denied.' });
            }
            const { idmovieapi, name } = req.headers;

            if (!idmovieapi && !name) {
                return res.status(400).json({ error: 'Erreur dans les données envoyées à la requête' });
            }

            let result;
            if (idmovieapi) {
                result = await movieService.dao.deleteMovie({ id: idmovieapi });
            } else if (name) {
                console.log(name)
                result = await movieService.dao.deleteMovie({ name: name });
            }

            if (!result || result.rowCount === 0) {
                return res.status(404).json({ error: 'Film non trouvé.' });
            }

            res.status(200).json({ message: 'Film supprimé avec succès.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression du Film.' });
        }
    });

    app.put("/movie", jwt.validateJWT, async (req, res) => {
        try {
            if (req.user.admin !== true) {
                return res.status(403).json({ error: 'Access denied.' });
            }
            const { id, name, newName, overview } = req.body;

            if (!id && !name) {
                return res.status(400).json({ error: 'ID or name must be provided for updating.' });
            }

            const updateObject = {};
            if (newName) {
                updateObject.name = newName;
            }
            if (overview) {
                updateObject.overview = overview;
            }
            let updatedSeries;
            if (id) {
                updatedSeries = await movieService.dao.updateMovie({ id: id }, updateObject);
            } else if (name) {
                console.log(name)
                updatedSeries =  await movieService.dao.updateMovie({ name: name }, updateObject);
            }

            if (!updatedSeries) {
                return res.status(404).json({ error: 'Série not found.' });
            }

            res.status(200).json({ message: 'Film mise à jour avec succès.', series: updatedSeries });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du Film.' });
        }
    });
}
