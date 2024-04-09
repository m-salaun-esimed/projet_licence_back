const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // URLEncoded form data
app.use(bodyParser.json()); // application/json
app.use(cors());
app.use(morgan('dev'));

const connectionString = process.env.CONNECTION_STRING;
const db = new pg.Pool({ connectionString: connectionString });
const port = process.env.PORT || 3333;


const UserService = require("./services/userservice");
const MovieService = require("./services/movieservice")
const CategorieService = require("./services/categorieservice")
const MovieCategoryService = require("./services/moviecategoryservice")
const FavoriteService= require("./services/favorite_service")
const AlreadySeenService= require("./services/already_seen_service")
const FriendsService= require("./services/friends_service")
const SerieCategoryService= require("./services/serie_category_service")
const SerieService= require("./services/serie_service")
const CategoryParSerieService= require("./services/category_par_serie_service")

const userService = new UserService(db);
const movieService = new MovieService(db);
const categorieService = new CategorieService(db);
const movieCategoryService= new MovieCategoryService(db);
const favoriteService = new FavoriteService(db)
const alreadySeenService = new AlreadySeenService(db)
const friendsService = new FriendsService(db)
const serieCategoryService = new SerieCategoryService(db)
const serieService = new SerieService(db)
const categoryParSerieService = new CategoryParSerieService(db)

const jwt = require('./jwt')(userService)
require('./api/userApi')(app, userService, jwt)
require('./api/movieApi')(app, movieService, jwt)
require('./api/categoryApi')(app, categorieService, jwt)
require('./api/favorite_api')(app, favoriteService, jwt)
require('./api/already_seen_api')(app, alreadySeenService, jwt)
require('./api/friends_api')(app, friendsService,userService, jwt)
require('./api/category_serie_api')(app, serieCategoryService, jwt)
require('./api/serie_api')(app, serieService, jwt)


const seedDatabase = async () => require('./datamodel/seeder')(userService, movieService , categorieService, movieCategoryService, serieCategoryService, serieService, categoryParSerieService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports = { app, seedDatabase, userService, movieService , categorieService, movieCategoryService, serieCategoryService, serieService }

//     .catch((error) => console.error('Error while seeding data:', error));