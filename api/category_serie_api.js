module.exports = (app, serieCategoryService, jwt) => {
    app.get("/serieCategory", jwt.validateJWT, async (req, res) => {
        console.log("test")
        try {
            const data = await serieCategoryService.dao.getserieCategory();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
