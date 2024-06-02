module.exports = async (app, serieService, jwt) => {
    app.get("/serie/random",jwt.validateJWT, async (req, res) => {
    try {
        const {categoryids} = req.headers;
        if(categoryids === undefined){
            res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
        }
        const categoryIdsArray = categoryids.split(',').map(id => parseInt(id));

        const series = await serieService.dao.getSeriesByCategories(categoryIdsArray);
        const response = await serieService.dao.getAllDejaVu(req.user.id);
        const alreadySeenIds = response.map(serie => serie.idapi);
        if (series.length < 5){
            return res.status(500).json({ error: 'Pas assez de film' });
        }
        const randomSeries = await getRandomSeries(series, 5, req.user.id);
        const idsSeries = randomSeries.map(movie => movie.idserie);
        const selectedSeries = await serieService.dao.getSeriesByIds(idsSeries);
        console.log(selectedSeries)

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


    app.get("/serie/byidserieapi", jwt.validateJWT, async (req, res) => {
        try {
            let { idserieapi } = req.headers;
            if(idserieapi === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
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
            if(idserieapi === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }

            const data = await serieService.dao.getPlatform(idserieapi);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete("/serie", jwt.validateJWT, async (req, res) => {
        try {
            const { idserieapi, name } = req.headers;

            if (!idserieapi && !name) {
                return res.status(400).json({ error: 'Erreur dans les données envoyées à la requête' });
            }

            let result;
            if (idserieapi) {
                result = await serieService.dao.deleteSerie({ id: idserieapi });
            } else if (name) {
                console.log(name)
                result = await serieService.dao.deleteSerie({ name: name });
            }

            if (!result || result.rowCount === 0) {
                return res.status(404).json({ error: 'Série non trouvée.' });
            }

            res.status(200).json({ message: 'Série supprimée avec succès.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la série.' });
        }
    });

    app.put("/serie", jwt.validateJWT, async (req, res) => {
        try {
            const { id, name, newName, overview } = req.body;

            if (!id && !name) {
                return res.status(400).json({ error: 'ID or name must be provided for updating.' });
            }

            const updateObject = {};
            if (newName) {
                updateObject.name = newName;
            }
            if (overview) {
                updateObject.overview = overview;
            }
            let updatedSeries;
            if (id) {
                updatedSeries = await serieService.dao.updateSerie({ id: id }, updateObject);
            } else if (name) {
                console.log(name)
                updatedSeries =  await serieService.dao.updateSerie({ name: name }, updateObject);
            }

            if (!updatedSeries) {
                return res.status(404).json({ error: 'Série not found.' });
            }

            res.status(200).json({ message: 'Série mise à jour avec succès.', series: updatedSeries });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la série.' });
        }
    });
}
