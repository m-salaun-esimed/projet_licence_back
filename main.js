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


const UserService = require("./services/userService");
const MovieService = require("./services/movieService")
const CategorieService = require("./services/categorieService")
const MovieCategoryService = require("./services/movieCategoryService")

const userService = new UserService(db);
const movieService = new MovieService(db);
const categorieService = new CategorieService(db);
const movieCategoryService= new MovieCategoryService(db);

const jwt = require('./jwt')(userService)
require('./api/userApi')(app, userService, jwt)
require('./api/movieApi')(app, movieService, jwt)
require('./api/categoryApi')(app, categorieService, jwt)

const seedDatabase = async () => require('./datamodel/seeder')(userService, movieService , categorieService, movieCategoryService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports = { app, seedDatabase, userService, movieService , categorieService, movieCategoryService }

//     .catch((error) => console.error('Error while seeding data:', error));
