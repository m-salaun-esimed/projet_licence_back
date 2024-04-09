module.exports = async (app, serieService, jwt) => {
    app.get("/getRandomSeries",jwt.validateJWT, async (req, res) => {
    try {
        const {categoryids} = req.headers;
        const categoryIdsArray = categoryids.split(',').map(id => parseInt(id));

        const series = await serieService.dao.getSeriesByCategories(categoryIdsArray);
        const response = await serieService.dao.getAllDejaVu(req.user.id);
        const alreadySeenIds = response.map(serie => serie.idapi);
        console.log(series)

        const randomSeries = await getRandomSeries(series, 5, req.user.id);
        const idsSeries = randomSeries.map(movie => movie.idserie);
        console.log(idsSeries)
        const selectedSeries = await serieService.dao.getSeriesByIds(idsSeries);


        for (let i = 0; i < selectedSeries.length; i++) {
            if (alreadySeenIds.includes(selectedSeries[i].idapi)) {
                return res.redirect('/getRandomSeries');
            }
        }
        res.json(selectedSeries);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur lors de la récupération des données.'});
    }
});

    function getRandomSeries(series, num) {
        const randomSeries = [];
        const totalSeries = series.length;
        const indices = new Set();

        while (indices.size < num) {
            const randomIndex = Math.floor(Math.random() * totalSeries);
            indices.add(randomIndex);
        }
        indices.forEach(index => {
            randomSeries.push(series[index]);
        });

        return randomSeries;
    }


    app.get("/serieByIdSerieApi", jwt.validateJWT, async (req, res) => {
        try {
            let { idserieapi } = req.headers;

            const data = await serieService.dao.getSerieByIdSerieApi(idserieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/serie/platform", jwt.validateJWT, async (req, res) => {
        try {
            const { idserieapi } = req.headers;
            const data = await serieService.dao.getPlatform(idserieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
