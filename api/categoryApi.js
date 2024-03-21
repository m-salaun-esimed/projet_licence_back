module.exports = (app, categoryApi) => {
    app.get("/movieCategory", async (req, res) => {
        try {
            const data = await categoryApi.dao.getAllMovieCategory();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
