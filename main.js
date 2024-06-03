const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// const connectionString = "postgres://main:main@postgresql.internal:5432/main";
// const connectionString = "postgres://tpadmin:tpadmin@localhost:5432/tpadmin";

var connectionString = process.env.CONNECTION_STRING
if (connectionString === undefined) {
    const { env } = process;
    const read_base64_json = function(varName) {
        try {
            return JSON.parse(Buffer.from(env[varName], "base64").toString())
        } catch (err) {
            throw new Error(`no ${varName} environment variable`)
        }
    };
    const variables = read_base64_json('PLATFORM_VARIABLES')
    connectionString = variables["CONNECTION_STRING"]
}

const db = new pg.Pool({ connectionString: connectionString });
const port = process.env.PORT || 3333;

const UserService = require("./services/user_service");
const MovieService = require("./services/movie_service")
const CategorieService = require("./services/category_service")
const MovieCategoryService = require("./services/movie_category_service")
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
require('./api/user_api')(app, userService, jwt)
require('./api/movie_api')(app, movieService, jwt)
require('./api/category_movie_api')(app, categorieService, jwt)
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