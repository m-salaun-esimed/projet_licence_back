const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // URLEncoded form data
app.use(bodyParser.json()); // application/json
app.use(cors());
app.use(morgan('dev'));

const connectionString = "postgres://tp_sql_user:azerty@localhost:5432/rouletteDB";
const db = new pg.Pool({ connectionString: connectionString });


const UserService = require("./services/UserService");
const MovieService = require("./services/movieService")
const StreamingService = require("./services/streamingPlatformService")
const CategorieService = require("./services/categorieService")

const userService = new UserService(db);
const movieService = new MovieService(db);
const streamingService = new StreamingService(db);
const categorieService = new CategorieService(db);

const jwt = require('./jwt')(userService)
require('./api/userApi')(app, userService, jwt)
require('./api/streamingPlatformApi')(app, streamingService)
require('./datamodel/seeder')(userService, movieService, streamingService, categorieService)
       .then(app.listen(3333))


//     .catch((error) => console.error('Error while seeding data:', error));