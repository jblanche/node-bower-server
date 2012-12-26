var expect = require('chai').expect;
var pkg ;

var database = require('../database');

before(function(done){
    database.init(function () {
        pkg = database.model;
        done();
    });
});

afterEach(function(done){
    pkg.remove({}, function() {
        done();
    });
});


describe('Package', function(){
  describe('at creation', function(){
    it('should have 0 hit', function(){
      expect((new pkg()).hits).to.equal(0);
    });

    it('should save creation date', function(){
      expect((new pkg())).to.have.property('createdAt');
    });

  });

  describe('validation', function () {
    it('should fail if url protocol is not git', function (done) {
        var foobar = new pkg({name: 'foo', url: 'http://bar'});
        foobar.save(function (err) {
            expect(err.errors).to.have.property('url');
            done();
        });
    });

    it('should succeed if url protocol is not git', function (done) {
        var foobar = new pkg({name: 'foo', url: 'git://foo'});
        foobar.save(function (err) {
            expect(err).to.be.a('null');
            done();
        });
    });

  });

  describe('behavior', function () {
    it('should add a hit', function () {
        var foobar = new pkg({name: 'foo', url: 'git://bar'});
        expect(foobar.hits).to.equal(0);
        foobar.hit();
        expect(foobar.hits).to.equal(1);
    });
  });
});
