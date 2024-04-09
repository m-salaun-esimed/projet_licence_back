const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userService, movieService , categorieService, movieCategoryService} = require("../main");   // TODO : remplacer par le nom de votre script principal
const {expect} = require("chai");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(50000);
    let token = '';

    before( (done) => {
        console.log("api.test.js : avant seeder")
        seedDatabase().then( async () => {
            console.log("Creating test user");

            const data = {
                displayName : "test",
                login: "test",
                password : "test",
                admin : false
            };
            userService.insertService(data).then( () =>
                chai.request(app)
                    .post('/user/authenticate')
                    .send({login: 'test', password: 'test'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        done();
                    })
            )})
    });

    it('should allow access with valid token', (done) => {
        chai.request(app)
            .get('/movieCategory')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('should deny access with invalid token', (done) => {
        chai.request(app)
            .get('/movieCategory')
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('getRandomMovies', (done) => {
        const categoryIds = '1,2,3';
        chai.request(app)
            .get('/getRandomMovies')
            .set('Authorization', `Bearer ${token}`)
            .set('categoryids', categoryIds)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('getRandomMovies invalid token', (done) => {
        const categoryIds = '1,2,3';
        chai.request(app)
            .get('/getRandomMovies')
            .set('Authorization', `Bearer wrongtoken`)
            .set('categoryids', categoryIds)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('post favorite movie & getAllFavorite', (done) => {
        const idapi = 984324;
        chai.request(app)
            .post('/postFavoriteMovie')
            .set('Authorization', `Bearer ${token}`)
            .send({ idapi})
            .end((err, res) => {
                res.should.have.status(200);

                chai.request(app)
                    .get(`/getAllFavoriteByIdUser`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        const favoriteMovie = res.body.find(movie => movie.idapi === idapi);
                        expect(favoriteMovie).to.exist;

                        done();
                    });
            });
    });

    it('post alreadySeen movie & getAll', (done) => {
        const idapi = 984324;
        chai.request(app)
            .post('/postAlreadySeenMovie')
            .set('Authorization', `Bearer ${token}`)
            .send({ idapi})
            .end((err, res) => {
                res.should.have.status(200);

                chai.request(app)
                    .get(`/getAllAlreadySeenMovie`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        const alreadySeenMovie = res.body.find(movie => movie.idapi === idapi);
                        expect(alreadySeenMovie).to.exist;

                        done();
                    });
            });
    });
});