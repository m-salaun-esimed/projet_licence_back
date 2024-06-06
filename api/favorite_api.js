module.exports = (app, favoriteService, jwt) => {
    app.get("/favorite", jwt.validateJWT, async (req, res) => {
        try {
            const type = req.headers.type
            const data = await favoriteService.dao.getAllFavoriteByIdUser(req.user.id, type);
            console.log(data)
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/favorite/user", jwt.validateJWT, async (req, res) => {
        try {
            const { iduser } = req.headers;
            console.log(iduser)
            const data = await favoriteService.dao.getAllFavoriteByIdUser(iduser);
            console.log(data)
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.post("/favorite/post", jwt.validateJWT,  async (req, res) => {
        try {
            const { idapi, typecontenu } = req.body;
            if (idapi === undefined || req.user === undefined) {
                res.status(400).end();
                return;
            }

            const data = {
                idapi : idapi,
                iduser: req.user.id,
                typecontenu : typecontenu
            };
            const response = await favoriteService.dao.insertFavorite(data);
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete('/favorite/delete', jwt.validateJWT, async (req, res) => {
        try {
            const idapi = req.body.idapi;
            const type = req.body.type;
            if (!idapi) {
                return res.status(400).json({ message: 'L\'ID de l\'événement est manquant dans le corps de la requête.' });
            }
            await favoriteService.dao.deleteFavoriteByMovieIdApiUser(idapi, req.user, type);

            res.status(200).json({ message: 'L\'événement a été supprimé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'événement.' });
        }
    });
}
