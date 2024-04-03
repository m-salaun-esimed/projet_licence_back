module.exports = (app, favoriteService, jwt) => {
    app.get("/getAllFavoriteByIdUser", jwt.validateJWT, async (req, res) => {
        try {
            const data = await favoriteService.dao.getAllFavoriteByIdUser(req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.post("/postFavoriteMovie", jwt.validateJWT,  async (req, res) => {
        try {
            const { idMovieApi } = req.body;
            if (idMovieApi === undefined || req.user === undefined) {
                res.status(400).end();
                return;
            }

            const data = {
                idmovieapi : idMovieApi,
                iduser: req.user.id
            };
            const response = await favoriteService.dao.insertFavorite(data);
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete('/deleteFavoriteByMovieIdApiUser', jwt.validateJWT, async (req, res) => {
        try {
            const movieidapi = req.body.movieidapi;
            if (!movieidapi) {
                return res.status(400).json({ message: 'L\'ID de l\'événement est manquant dans le corps de la requête.' });
            }
            await favoriteService.dao.deleteFavoriteByMovieIdApiUser(movieidapi, req.user);

            res.status(200).json({ message: 'L\'événement a été supprimé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'événement.' });
        }
    });

    app.get("/searchMovies",jwt.validateJWT, async (req, res) => {
        try {
            const { query } = req.headers;
            console.log("query " + query)
            const movies = await favoriteService.dao.getMoviesBySearch(query, req.user);
            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
