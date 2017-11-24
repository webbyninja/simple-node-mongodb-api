//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let ObjectDB = require('../app/models/object');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Object', () => {
    beforeEach((done) => { //Before each test we empty the database
        ObjectDB.remove({}, (err) => { 
           done();         
        });     
    });
    /*
    * Test the /POST route
    */
    describe('/POST object', () => {
        it('it should add a SINGLE object', function(done) {
            chai.request(server)
            .post('/object')
            .send({'mykey0': 'value0'})
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('key');
                res.body.key.should.equal('mykey0');
                res.body.should.have.property('value');
                res.body.value.should.equal('value0');
                res.body.should.have.property('timestamp');
                // res.body.key.should.be.a('object');
                // res.body.value.should.be.a('object');
                // res.body.timestamp.should.be.a('object');
                done();
            });
        });
    });
    /*
    * Test the /GET route
    */
    describe('/GET object', () => {
        it('it should GET all the objects', (done) => {
            chai.request(server)
                .get('/object')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
                });
        });
    });

    /*
    * Test the /GET/:key route
    */
    describe('/GET/:key object', () => {
        it('should list a SINGLE object on /object/<key> GET', function(done) {
            var newObject = new ObjectDB({
              key: 'mykey1',
              value: 'value1'
            });
            newObject.save(function(err, data) {
              chai.request(server)
                .get('/object/'+data.key)
                .end(function(err, res){
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('value');
                  res.body.value.should.equal('value1');
                  done();
                });
            });
        });
    });
    

});