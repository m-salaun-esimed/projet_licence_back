module.exports = (app, categoryApi, jwt) => {
    app.get("/movieCategory",jwt.validateJWT, async (req, res) => {
        try {
            const data = await categoryApi.dao.getAllMovieCategory();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/movieCategorysByIdMovie",jwt.validateJWT, async (req, res) => {
        try {
            const { idMovie } = req.headers;
            const data = await categoryApi.dao.getAllByIdMovie(idMovie);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
