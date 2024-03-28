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
                    .send({login: 'test', password: 'test'}) // TODO : remplacer par les champs attendus par votre route
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

});