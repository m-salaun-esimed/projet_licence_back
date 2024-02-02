
module.exports = (app, streamingService) => {
    app.get("/streamingPlatform", async (req, res) => {
        try {
            const data = await streamingService.dao.getAllstreamingPlatform();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
