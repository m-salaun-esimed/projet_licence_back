module.exports = (app, alreadySeenService, jwt) => {
    app.get("/getAllAlreadySeenMovie", jwt.validateJWT, async (req, res) => {
        console.log("test")
        try {
            const data = await alreadySeenService.dao.getAllAlreadySeenMovie(req.user);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.post("/postAlreadySeenMovie", jwt.validateJWT,  async (req, res) => {
        try {
            const { idMovieApi } = req.body;
            console.log("idMovieApi" + idMovieApi)
            if (idMovieApi === undefined || req.user === undefined) {
                res.status(400).end();
                return;
            }

            const data = {
                idmovieapi : idMovieApi,
                iduser: req.user.id
            };
            const response = await alreadySeenService.dao.insertAlreadySeenMovie(data);
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete('/deleteAlreadySeenMovieByMovieIdApiUser', jwt.validateJWT, async (req, res) => {
        try {
            const movieidapi = req.body.movieidapi;
            if (!movieidapi) {
                return res.status(400).json({ message: 'L\'ID de l\'événement est manquant dans le corps de la requête.' });
            }
            await alreadySeenService.dao.deleteAlreadySeenMovieByMovieIdApi(movieidapi, req.user);

            res.status(200).json({ message: 'L\'événement a été supprimé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'événement.' });
        }
    });
}
