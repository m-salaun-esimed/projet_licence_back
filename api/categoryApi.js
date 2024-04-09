module.exports = (app, categoryService, jwt) => {
    app.get("/movieCategory",jwt.validateJWT, async (req, res) => {
        try {
            const data = await categoryService.dao.getAllMovieCategory();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/movieCategorysByIdMovie",jwt.validateJWT, async (req, res) => {
        try {
            const { idMovie } = req.headers;
            const data = await categoryService.dao.getAllByIdMovie(idMovie);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
