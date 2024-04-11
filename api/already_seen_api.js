module.exports = (app, alreadySeenService, jwt) => {
    app.get("/alreadySeenMovie", jwt.validateJWT, async (req, res) => {
        console.log("test")
        try {
            const data = await alreadySeenService.dao.getAlreadySeenMovie(req.user);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.post("/alreadySeenMovie/post", jwt.validateJWT,  async (req, res) => {
        try {
            const { idapi, typecontenu } = req.body;
            console.log("idMovieApi" + idapi)
            if (idapi === undefined || req.user === undefined) {
                res.status(400).end();
                return;
            }

            const data = {
                idapi : idapi,
                iduser: req.user.id,
                typecontenu : typecontenu
            };
            const response = await alreadySeenService.dao.insertAlreadySeenMovie(data);
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete('/alreadySeenMovie/delete', jwt.validateJWT, async (req, res) => {
        try {
            const { idapi, typecontenu } = req.body;
            if (!idapi) {
                return res.status(400).json({ message: 'L\'ID de l\'événement est manquant dans le corps de la requête.' });
            }
            await alreadySeenService.dao.deleteAlreadySeenMovie(idapi, req.user, typecontenu);

            res.status(200).json({ message: 'L\'événement a été supprimé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'événement.' });
        }
    });
}
