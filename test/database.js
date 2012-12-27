var expect = require('chai').expect;
var database = require('../database').init();
var pkg = database.Package;

database.sequelize.options.logging = false ;

describe('Package', function(){
  describe('at creation', function(){
    it('should have 0 hit', function(){
      expect(pkg.build().hits).to.equal(0);
    });

    it('should save creation date', function(){
      expect(pkg.build()).to.have.property('createdAt');
    });

  });

  describe('validation', function () {
    it('should fail if url protocol is not git', function () {
        expect(pkg.build({url: 'lalala'}).validate()).to.have.property('url');
        expect(pkg.build({url: 'http://lalala'}).validate()).to.have.property('url');
        expect(pkg.build({url: 'git://lalala'}).validate()).to.be.a('null');
    });
  });

  describe('behavior', function () {
    it('should add a hit', function () {
        var foobar = pkg.build({name: 'foo', url: 'git://bar'});
        expect(foobar.hits).to.equal(0);
        foobar.hit();
        expect(foobar.hits).to.equal(1);
    });
  });
});
