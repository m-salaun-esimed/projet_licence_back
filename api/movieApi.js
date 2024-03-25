module.exports = (app, movieService) => {
    app.get("/movie", async (req, res) => {
        try {
            const data = await movieService.dao.getAllMovie();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/getRandomMovies", async (req, res) => {
        try {
            const { categoryids } = req.headers;
            const categoryIdsArray = categoryids.split(',').map(id => parseInt(id));

            const movies = await movieService.dao.getMoviesByCategories(categoryIdsArray);
            console.log(movies)
            const randomMovies = getRandomMovies(movies, 5);
            console.log(randomMovies)
            const idMovies = randomMovies.map(movie => movie.idmovie);
            const selectedMovies = await movieService.dao.getMoviesByIds(idMovies);

            res.json(selectedMovies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    function getRandomMovies(movies, num) {
        const randomMovies = [];
        const totalMovies = movies.length;
        const indices = new Set();
        while (indices.size < num) {
            const randomIndex = Math.floor(Math.random() * totalMovies);
            indices.add(randomIndex);
        }
        indices.forEach(index => {
            randomMovies.push(movies[index]);
        });

        return randomMovies;
    }

}
