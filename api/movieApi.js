// module.exports = (app, movieService) => {
//     app.get("/movieCategory", async (req, res) => {
//         try {
//             const data = await movieService.dao.getAllMovieCategory();
//             res.json(data);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
//         }
//     });
// }
